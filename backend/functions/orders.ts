/**
 * Orders Lambda Handler
 * API endpoints for order history and product access
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ordersService } from '../core/orders.service.js';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const { httpMethod, path, pathParameters } = event;

    // Mock user ID (in production, extract from JWT token)
    const userId = event.headers['x-user-id'] || 'mock-user-123';

    // GET /orders - Get user's order history
    if (httpMethod === 'GET' && path === '/orders') {
      const limit = event.queryStringParameters?.limit
        ? Number(event.queryStringParameters.limit)
        : 50;

      const orders = await ordersService.getUserOrders(userId, limit);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ orders }),
      };
    }

    // GET /orders/{id} - Get single order details
    if (httpMethod === 'GET' && pathParameters?.id) {
      const order = await ordersService.getOrder(pathParameters.id);

      if (!order) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Order not found' }),
        };
      }

      // Verify user owns this order
      if (order.userId !== userId) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ order }),
      };
    }

    // GET /access - Get user's accessible products (purchase history)
    if (httpMethod === 'GET' && path === '/access') {
      const products = await ordersService.getUserAccessibleProducts(userId);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ products }),
      };
    }

    // GET /downloads/{productId} - Get download URL for product
    if (httpMethod === 'GET' && path.startsWith('/downloads/') && pathParameters?.productId) {
      const hasAccess = await ordersService.hasAccess(userId, pathParameters.productId);

      if (!hasAccess) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: 'No access to this product' }),
        };
      }

      // Increment download count
      await ordersService.incrementDownloadCount(userId, pathParameters.productId);

      // In production, generate signed S3 URL
      const downloadUrl = `/mock-download/${pathParameters.productId}`;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ downloadUrl }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error: any) {
    console.error('Orders API Error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
}
