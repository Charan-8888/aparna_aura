from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from core.responses import success_response, created_response
from .serializers import (
    RazorpayCreateSerializer,
    RazorpayVerifySerializer,
    CODSerializer,
    TransactionSerializer,
)
from .services import (
    create_razorpay_order,
    verify_razorpay_payment,
    process_cod,
    get_transaction_detail,
)


class RazorpayCreateView(APIView):
    """
    POST /payments/create/
    Create a Razorpay order for the given Order ID.
    Returns the data needed by the frontend to open Razorpay checkout.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RazorpayCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = create_razorpay_order(
            user=request.user,
            order_id=serializer.validated_data['order_id'],
        )
        return created_response(data=result, message="Razorpay order created.")


class RazorpayVerifyView(APIView):
    """
    POST /payments/verify/
    Verify the Razorpay payment signature after the user completes payment.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RazorpayVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        txn = verify_razorpay_payment(
            user=request.user,
            razorpay_order_id=serializer.validated_data['razorpay_order_id'],
            razorpay_payment_id=serializer.validated_data['razorpay_payment_id'],
            razorpay_signature=serializer.validated_data['razorpay_signature'],
        )
        output = TransactionSerializer(txn)
        return success_response(data=output.data, message="Payment verified successfully.")


class CODCreateView(APIView):
    """
    POST /payments/cod/
    Select Cash on Delivery for the given Order.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CODSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        txn = process_cod(
            user=request.user,
            order_id=serializer.validated_data['order_id'],
        )
        output = TransactionSerializer(txn)
        return created_response(data=output.data, message="Cash on Delivery selected.")


class TransactionDetailView(APIView):
    """
    GET /payments/{transaction_id}/
    Retrieve transaction details.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, transaction_id):
        txn = get_transaction_detail(
            user=request.user,
            transaction_id=transaction_id,
        )
        output = TransactionSerializer(txn)
        return success_response(data=output.data, message="Transaction retrieved.")
