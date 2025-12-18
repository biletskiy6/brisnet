/**
 * Cart Lambda Handler
 * API endpoints for shopping cart management
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { cartService } from '../core/cart.service.js';
import { productsService } from '../core/products.service.js';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const { httpMethod, path, pathParameters } = event;

    // Mock user ID (in production, extract from JWT token)
    const userId = event.headers['x-user-id'] || 'mock-user-123';

    // GET /cart - Get current cart with totals
    if (httpMethod === 'GET' && path === '/cart') {
      const cart = await cartService.getCartWithTotals(userId, productsService);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ cart }),
      };
    }

    // POST /cart/items - Add item to cart
    if (httpMethod === 'POST' && path === '/cart/items') {
      const body = JSON.parse(event.body || '{}');
      const { productId, paymentMethod = 'cash' } = body;

      if (!productId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'productId is required' }),
        };
      }

      // Verify product exists
      const product = await productsService.getProduct(productId);
      if (!product) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Product not found' }),
        };
      }

      const cart = cartService.addItem(userId, productId, paymentMethod);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ cart, message: 'Item added to cart' }),
      };
    }

    // DELETE /cart/items/{productId} - Remove item from cart
    if (httpMethod === 'DELETE' && pathParameters?.productId) {
      const cart = cartService.removeItem(userId, pathParameters.productId);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ cart, message: 'Item removed from cart' }),
      };
    }

    // PATCH /cart/items/{productId} - Update payment method
    if (httpMethod === 'PATCH' && pathParameters?.productId) {
      const body = JSON.parse(event.body || '{}');
      const { paymentMethod } = body;

      if (!paymentMethod || !['cash', 'credits'].includes(paymentMethod)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Valid paymentMethod required (cash or credits)' }),
        };
      }

      const cart = cartService.updatePaymentMethod(userId, pathParameters.productId, paymentMethod);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ cart, message: 'Payment method updated' }),
      };
    }

    // DELETE /cart - Clear cart
    if (httpMethod === 'DELETE' && path === '/cart') {
      const cart = cartService.clearCart(userId);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ cart, message: 'Cart cleared' }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error: any) {
    console.error('Cart API Error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
}
