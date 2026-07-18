from rest_framework import serializers
from .models import Transaction


class RazorpayCreateSerializer(serializers.Serializer):
    """Input for POST /payments/create/ — initiate Razorpay order."""
    order_id = serializers.UUIDField()


class RazorpayVerifySerializer(serializers.Serializer):
    """Input for POST /payments/verify/ — verify Razorpay payment."""
    razorpay_order_id = serializers.CharField(max_length=100)
    razorpay_payment_id = serializers.CharField(max_length=100)
    razorpay_signature = serializers.CharField(max_length=255)


class CODSerializer(serializers.Serializer):
    """Input for POST /payments/cod/ — select Cash on Delivery."""
    order_id = serializers.UUIDField()


class TransactionSerializer(serializers.ModelSerializer):
    """Read-only serializer for transaction details."""

    class Meta:
        model = Transaction
        fields = (
            'id', 'order', 'transaction_id',
            'payment_method', 'payment_gateway', 'status', 'amount',
            'razorpay_order_id', 'razorpay_payment_id',
            'created_at', 'updated_at',
        )
        read_only_fields = fields


class RazorpayOrderResponseSerializer(serializers.Serializer):
    """Output serializer for the Razorpay create response."""
    razorpay_order_id = serializers.CharField()
    key_id = serializers.CharField()
    amount = serializers.IntegerField()
    currency = serializers.CharField()
    order_id = serializers.CharField()
