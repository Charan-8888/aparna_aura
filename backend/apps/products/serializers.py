from rest_framework import serializers
from .models import Category, Product, ProductImage


def secure_image_url(image):
    """Return uploaded Cloudinary media using a browser-safe HTTPS URL."""
    if not image:
        return None

    try:
        url = image.url
    except Exception:
        url = str(image)

    return url.replace('http://res.cloudinary.com/', 'https://res.cloudinary.com/', 1)


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_image(self, obj):
        return secure_image_url(obj.image)
        


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'is_featured', 'alt_text')

    def get_image(self, obj):
        return secure_image_url(obj.image)


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
