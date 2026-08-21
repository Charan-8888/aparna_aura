from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image_preview', 'image', 'is_featured', 'alt_text')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" class="admin-thumbnail" style="width: 50px; height: 50px; object-fit: cover;" />', obj.image.url)
        return "—"
    image_preview.short_description = 'Preview'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('image_preview', 'name', 'slug', 'is_active', 'display_order', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('display_order',)
    readonly_fields = ('image_preview', 'created_at')
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" class="admin-thumbnail" style="width: 50px; height: 50px; object-fit: cover;" />', obj.image.url)
        return "—"
    image_preview.short_description = 'Image'

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('image_thumbnail', 'name', 'category', 'sku', 'price', 'discount_percentage', 'stock', 'is_active', 'is_featured', 'is_trending', 'is_new_arrival', 'created_at')
    list_filter = ('category', 'is_active', 'is_featured', 'is_trending', 'is_new_arrival')
    search_fields = ('name', 'sku', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'category', 'sku', 'description')
        }),
        ('Pricing', {
            'fields': ('price', 'discount_percentage')
        }),
        ('Inventory', {
            'fields': ('stock',)
        }),
        ('Visibility', {
            'fields': ('is_active', 'is_featured', 'is_trending', 'is_new_arrival')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description')
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('category').prefetch_related('images')

    def image_thumbnail(self, obj):
        first_image = obj.images.first()
        if first_image and first_image.image:
            return format_html('<img src="{}" class="admin-thumbnail" style="width: 40px; height: 40px; object-fit: cover;" />', first_image.image.url)
        return "—"
    image_thumbnail.short_description = 'Image'
