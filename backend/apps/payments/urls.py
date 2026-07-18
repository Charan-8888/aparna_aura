from django.urls import path
from .views import (
    RazorpayCreateView,
    RazorpayVerifyView,
    CODCreateView,
    TransactionDetailView,
)

urlpatterns = [
    path('create/', RazorpayCreateView.as_view(), name='payment-create'),
    path('verify/', RazorpayVerifyView.as_view(), name='payment-verify'),
    path('cod/', CODCreateView.as_view(), name='payment-cod'),
    path('<uuid:transaction_id>/', TransactionDetailView.as_view(), name='payment-detail'),
]
