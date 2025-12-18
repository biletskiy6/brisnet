/**
 * Checkout Lambda Handler
 * API endpoints for checkout and payment processing
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { checkoutService } from '../core/checkout.service.js';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const { httpMethod, path } = event;

    // Mock user ID (in production, extract from JWT token)
    const userId = event.headers['x-user-id'] || 'mock-user-123';

    // POST /checkout/cash - Checkout with cash payment
    if (httpMethod === 'POST' && path === '/checkout/cash') {
      const body = JSON.parse(event.body || '{}');
      const { cardDetails } = body;

      if (!cardDetails) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'cardDetails required' }),
        };
      }

      const result = await checkoutService.checkoutWithCash(userId, cardDetails);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
      };
    }

    // POST /checkout/credits - Checkout with credits only
    if (httpMethod === 'POST' && path === '/checkout/credits') {
      const result = await checkoutService.checkoutWithCredits(userId);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
      };
    }

    // POST /checkout/mixed - Checkout with mixed payment (cash + credits)
    if (httpMethod === 'POST' && path === '/checkout/mixed') {
      const body = JSON.parse(event.body || '{}');
      const { cardDetails } = body;

      const result = await checkoutService.checkoutMixed(userId, cardDetails);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error: any) {
    console.error('Checkout API Error:', error);

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: error.message || 'Checkout failed' }),
    };
  }
}
