from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'order', 'payment_method', 'payment_gateway',
        'status', 'amount', 'razorpay_order_id', 'created_at',
    )
    list_filter = ('status', 'payment_method', 'payment_gateway', 'created_at')
    search_fields = (
        'id', 'razorpay_order_id', 'razorpay_payment_id',
        'transaction_id', 'order__id', 'order__user__email',
    )
    readonly_fields = (
        'id', 'order', 'transaction_id',
        'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature',
        'amount', 'response_payload', 'created_at', 'updated_at',
    )
    list_select_related = ('order',)
    ordering = ('-created_at',)

    def get_readonly_fields(self, request, obj=None):
        """Make every field readonly once the transaction has succeeded."""
        if obj and obj.status == 'success':
            return [f.name for f in self.model._meta.fields]
        return self.readonly_fields
