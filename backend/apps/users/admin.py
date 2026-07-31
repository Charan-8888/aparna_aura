from django.contrib import admin
from .models import User, Profile, Address

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('role', 'is_active', 'is_staff')

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone')
    search_fields = ('user__email',)

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'phone', 'city', 'state', 'pincode', 'is_default')
    search_fields = ('user__email', 'full_name', 'city', 'pincode')
    list_filter = ('is_default', 'state')
