"""
apps.payments.services
~~~~~~~~~~~~~~~~~~~~~~
Business logic for Razorpay online payments and Cash on Delivery.

All amount calculations are derived from the Order — never from the frontend.
"""

import logging
import hashlib
import hmac
from decimal import Decimal

import razorpay
from django.conf import settings
from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.orders.models import Order
from .models import Transaction

logger = logging.getLogger('api.errors')

# ── Razorpay client (lazy singleton) ──────────────────────────────────────────

_razorpay_client = None


def _get_razorpay_client():
    """Return a lazily-initialised Razorpay client."""
    global _razorpay_client
    if _razorpay_client is None:
        key_id = settings.RAZORPAY_KEY_ID
        key_secret = settings.RAZORPAY_KEY_SECRET
        if not key_id or not key_secret:
            raise ValidationError({"payment": "Razorpay is not configured on this server."})
        _razorpay_client = razorpay.Client(auth=(key_id, key_secret))
    return _razorpay_client


# ── Constants ─────────────────────────────────────────────────────────────────

COD_MAX_LIMIT = getattr(settings, 'COD_MAX_LIMIT', Decimal('50000.00'))
CURRENCY = 'INR'


# ── Helpers ───────────────────────────────────────────────────────────────────

def _validate_order_for_payment(user, order_id):
    """
    Shared validation: order must exist, belong to the user,
    be in 'pending' status, and not already have a transaction.
    """
    try:
        order = Order.objects.get(id=order_id, user=user)
    except Order.DoesNotExist:
        raise ValidationError({"order": "Order not found."})

    if order.status != 'pending':
        raise ValidationError({"order": f"Cannot initiate payment for an order with status '{order.status}'."})

    if hasattr(order, 'transaction') and order.transaction.status == 'success':
        raise ValidationError({"order": "This order has already been paid."})

    return order


# ── Razorpay: Create ─────────────────────────────────────────────────────────

@transaction.atomic
def create_razorpay_order(user, order_id):
    """
    Creates a Razorpay order and a pending Transaction record.

    Returns a dict the frontend needs to open the Razorpay checkout:
        razorpay_order_id, key_id, amount (paise), currency
    """
    order = _validate_order_for_payment(user, order_id)

    # Amount in paise (Razorpay expects integer paise)
    amount_paise = int(order.total_amount * 100)

    client = _get_razorpay_client()

    try:
        rz_order = client.order.create({
            'amount': amount_paise,
            'currency': CURRENCY,
            'receipt': str(order.id),
            'payment_capture': 1,  # auto-capture
        })
    except Exception as exc:
        logger.error("Razorpay order creation failed: %s", exc)
        raise ValidationError({"payment": "Payment gateway error. Please try again."})

    # Upsert transaction (handle retry scenarios)
    txn, _created = Transaction.objects.update_or_create(
        order=order,
        defaults={
            'razorpay_order_id': rz_order['id'],
            'payment_gateway': 'razorpay',
            'payment_method': 'CARD',   # will be determined at verification
            'status': 'pending',
            'amount': order.total_amount,
            'response_payload': rz_order,
        },
    )

    return {
        'razorpay_order_id': rz_order['id'],
        'key_id': settings.RAZORPAY_KEY_ID,
        'amount': amount_paise,
        'currency': CURRENCY,
        'order_id': str(order.id),
    }


# ── Razorpay: Verify ─────────────────────────────────────────────────────────

@transaction.atomic
def verify_razorpay_payment(user, razorpay_order_id, razorpay_payment_id, razorpay_signature):
    """
    Verify the Razorpay payment signature.

    On success → Transaction.status = 'success', Order.status = 'confirmed'.
    On failure → Transaction.status = 'failed'.
    """
    try:
        txn = (
            Transaction.objects
            .select_for_update()
            .select_related('order')
            .get(razorpay_order_id=razorpay_order_id, order__user=user)
        )
    except Transaction.DoesNotExist:
        raise ValidationError({"payment": "Transaction not found."})

    if txn.status == 'success':
        raise ValidationError({"payment": "This payment has already been verified."})

    client = _get_razorpay_client()

    # Verify signature
    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature,
        })
    except razorpay.errors.SignatureVerificationError:
        txn.status = 'failed'
        txn.razorpay_payment_id = razorpay_payment_id
        txn.razorpay_signature = razorpay_signature
        txn.response_payload = {
            'error': 'Signature verification failed',
            'razorpay_payment_id': razorpay_payment_id,
        }
        txn.save()
        raise ValidationError({"payment": "Payment verification failed. Invalid signature."})

    # Signature valid — mark success
    txn.status = 'success'
    txn.razorpay_payment_id = razorpay_payment_id
    txn.razorpay_signature = razorpay_signature
    txn.transaction_id = razorpay_payment_id  # store as canonical transaction ID
    txn.response_payload = {
        'razorpay_order_id': razorpay_order_id,
        'razorpay_payment_id': razorpay_payment_id,
        'razorpay_signature': razorpay_signature,
    }
    txn.save()

    # Confirm the order
    order = txn.order
    order.status = 'confirmed'
    order.save(update_fields=['status', 'updated_at'])

    return txn


# ── Cash on Delivery ──────────────────────────────────────────────────────────

@transaction.atomic
def process_cod(user, order_id):
    """
    Create a COD transaction.

    Validates the order total does not exceed the configurable COD limit.
    Order remains in 'pending' until admin confirms delivery.
    """
    order = _validate_order_for_payment(user, order_id)

    if order.total_amount > COD_MAX_LIMIT:
        raise ValidationError({
            "payment": f"Cash on Delivery is not available for orders above ₹{COD_MAX_LIMIT}."
        })

    txn, _created = Transaction.objects.update_or_create(
        order=order,
        defaults={
            'payment_method': 'COD',
            'payment_gateway': 'cod',
            'status': 'pending',
            'amount': order.total_amount,
            'transaction_id': None,
            'razorpay_order_id': None,
            'razorpay_payment_id': None,
            'razorpay_signature': None,
            'response_payload': None,
        },
    )

    return txn


# ── Read ──────────────────────────────────────────────────────────────────────

def get_transaction_detail(user, transaction_id):
    """Return a single transaction belonging to the user."""
    try:
        return (
            Transaction.objects
            .select_related('order')
            .get(id=transaction_id, order__user=user)
        )
    except Transaction.DoesNotExist:
        raise ValidationError({"transaction": "Transaction not found."})


def verify_razorpay_webhook_signature(payload, signature):
    """Validate Razorpay's HMAC on the exact raw request body."""
    secret = settings.RAZORPAY_WEBHOOK_SECRET
    if not secret or not signature:
        return False
    expected = hmac.new(secret.encode('utf-8'), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def _payment_method_from_razorpay(value):
    return {
        'upi': 'UPI', 'card': 'CARD', 'netbanking': 'NETBANKING', 'wallet': 'WALLET',
    }.get((value or '').lower(), 'CARD')


@transaction.atomic
def process_razorpay_webhook(event):
    """Apply captured/failed events safely; duplicate deliveries are harmless."""
    event_name = event.get('event')
    payment = event.get('payload', {}).get('payment', {}).get('entity', {})
    razorpay_order_id = payment.get('order_id')
    if not razorpay_order_id:
        return

    try:
        txn = Transaction.objects.select_for_update().select_related('order').get(
            razorpay_order_id=razorpay_order_id,
            payment_gateway='razorpay',
        )
    except Transaction.DoesNotExist:
        logger.warning('Ignoring Razorpay webhook for an unknown order.')
        return

    if event_name == 'payment.captured':
        # A duplicate captured event or a later failed event must never undo success.
        if txn.status == 'success':
            return
        if payment.get('amount') is not None and payment['amount'] != int(txn.amount * 100):
            logger.error('Ignoring Razorpay webhook with an unexpected payment amount.')
            return
        txn.status = 'success'
        txn.payment_method = _payment_method_from_razorpay(payment.get('method'))
        txn.razorpay_payment_id = payment.get('id') or txn.razorpay_payment_id
        txn.transaction_id = txn.razorpay_payment_id
        txn.response_payload = {'event': event_name, 'payment_id': txn.razorpay_payment_id}
        txn.save()
        if txn.order.status == 'pending':
            txn.order.status = 'confirmed'
            txn.order.save(update_fields=['status', 'updated_at'])
    elif event_name == 'payment.failed' and txn.status != 'success':
        txn.status = 'failed'
        txn.razorpay_payment_id = payment.get('id') or txn.razorpay_payment_id
        txn.response_payload = {'event': event_name, 'payment_id': txn.razorpay_payment_id}
        txn.save(update_fields=['status', 'razorpay_payment_id', 'response_payload', 'updated_at'])
