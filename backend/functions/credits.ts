/**
 * Credits Lambda Handler
 * API endpoints for credit balance and transactions
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { creditsService } from '../core/credits.service.js';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const { httpMethod, path } = event;

    // Mock user ID (in production, extract from JWT token)
    const userId = event.headers['x-user-id'] || 'mock-user-123';

    // GET /credits/balance - Get user's credit balance
    if (httpMethod === 'GET' && path === '/credits/balance') {
      const balance = await creditsService.getBalance(userId);
      const expiringCredits = await creditsService.getExpiringCredits(userId, 30);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ balance, expiringCredits }),
      };
    }

    // GET /credits/transactions - Get transaction history
    if (httpMethod === 'GET' && path === '/credits/transactions') {
      const limit = event.queryStringParameters?.limit
        ? Number(event.queryStringParameters.limit)
        : 50;

      const transactions = await creditsService.getTransactionHistory(userId, limit);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ transactions }),
      };
    }

    // POST /credits/purchase - Purchase credits with cash
    if (httpMethod === 'POST' && path === '/credits/purchase') {
      const body = JSON.parse(event.body || '{}');
      const { amount, paymentTransactionId, expiresInDays } = body;

      if (!amount || !paymentTransactionId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'amount and paymentTransactionId required' }),
        };
      }

      const transaction = await creditsService.purchaseCredits(
        userId,
        amount,
        paymentTransactionId,
        expiresInDays
      );

      const balance = await creditsService.getBalance(userId);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ transaction, balance, message: 'Credits purchased successfully' }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error: any) {
    console.error('Credits API Error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
}
