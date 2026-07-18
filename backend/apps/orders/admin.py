from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'unit_price')
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'id')
    readonly_fields = ('user', 'subtotal', 'tax_amount', 'shipping_fee', 'discount_amount', 'total_amount', 'shipping_address', 'billing_address', 'created_at', 'updated_at')
    inlines = [OrderItemInline]

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.status in ['cancelled', 'delivered', 'refunded']:
            return [f.name for f in self.model._meta.fields]
        return self.readonly_fields

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product', 'quantity', 'unit_price')
    search_fields = ('order__id', 'product__name')
    readonly_fields = ('order', 'product', 'quantity', 'unit_price')
