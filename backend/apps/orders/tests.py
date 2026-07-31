from django.contrib.auth import get_user_model
from django.test import TestCase
from .models import Order
from rest_framework.test import APITestCase

User = get_user_model()

class OrderModelTests(TestCase):
    def test_order_creation_stub(self):
        # TODO: Test creating an order model directly
        self.assertTrue(True)

class CheckoutServiceTests(TestCase):
    def test_checkout_success_stub(self):
        # TODO: Test successful checkout flow
        self.assertTrue(True)
        
    def test_checkout_empty_cart_stub(self):
        # TODO: Test checkout with empty cart raises ValidationError
        self.assertTrue(True)
        
    def test_checkout_invalid_address_stub(self):
        # TODO: Test checkout with address not belonging to user raises ValidationError
        self.assertTrue(True)
        
    def test_checkout_insufficient_stock_stub(self):
        # TODO: Test checkout when a product doesn't have enough stock raises ValidationError
        self.assertTrue(True)
        
    def test_checkout_inactive_product_stub(self):
        # TODO: Test checkout when a product is inactive raises ValidationError
        self.assertTrue(True)

class OrderCancellationServiceTests(TestCase):
    def test_cancel_pending_order_success_stub(self):
        # TODO: Test cancelling a pending order correctly refunds stock and updates status
        self.assertTrue(True)
        
    def test_cancel_shipped_order_fails_stub(self):
        # TODO: Test cancelling a shipped order raises ValidationError
        self.assertTrue(True)
        
    def test_cancel_other_user_order_fails_stub(self):
        # TODO: Test cancelling an order belonging to someone else raises ValidationError
        self.assertTrue(True)

class OrderAPITests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            email='order-owner@example.com', password='OwnerPassword123!', first_name='Owner', last_name='Example'
        )
        self.other_user = User.objects.create_user(
            email='order-other@example.com', password='OtherPassword123!', first_name='Other', last_name='Example'
        )
        self.order = Order.objects.create(user=self.owner, total_amount='100.00')

    def test_checkout_api_stub(self):
        # TODO: Test POST /orders/checkout/ returns 201 Created
        self.assertTrue(True)
        
    def test_list_orders_api_stub(self):
        # TODO: Test GET /orders/ returns user's orders
        self.assertTrue(True)
        
    def test_detail_order_api_stub(self):
        # TODO: Test GET /orders/{id}/ returns order details
        self.assertTrue(True)
        
    def test_cancel_order_api_stub(self):
        # TODO: Test POST /orders/{id}/cancel/ returns 200 OK
        self.assertTrue(True)
        
    def test_unauthenticated_access_stub(self):
        # TODO: Test accessing any endpoint without auth returns 401
        self.assertTrue(True)

    def test_other_customer_cannot_read_or_cancel_order_by_uuid(self):
        self.client.force_authenticate(self.other_user)
        detail_url = f'/api/v1/orders/{self.order.id}/'
        cancel_url = f'/api/v1/orders/{self.order.id}/cancel/'

        self.assertEqual(self.client.get(detail_url).status_code, 404)
        self.assertEqual(self.client.post(cancel_url, {}, format='json').status_code, 400)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'pending')
