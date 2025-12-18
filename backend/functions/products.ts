/**
 * Products Lambda Handler
 * API endpoints for product catalog
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { productsService } from '../core/products.service.js';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const { httpMethod, path, pathParameters, queryStringParameters } = event;

    // GET /products - List all products with filters
    if (httpMethod === 'GET' && path === '/products') {
      const filters = {
        tracks: queryStringParameters?.tracks?.split(','),
        productTypes: queryStringParameters?.productTypes?.split(','),
        creators: queryStringParameters?.creators?.split(','),
        searchQuery: queryStringParameters?.search,
        isFeatured: queryStringParameters?.featured === 'true',
        minPrice: queryStringParameters?.minPrice ? Number(queryStringParameters.minPrice) : undefined,
        maxPrice: queryStringParameters?.maxPrice ? Number(queryStringParameters.maxPrice) : undefined,
      };

      const products = await productsService.getProducts(filters);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ products }),
      };
    }

    // GET /products/featured - Get featured products
    if (httpMethod === 'GET' && path === '/products/featured') {
      const limit = queryStringParameters?.limit ? Number(queryStringParameters.limit) : 10;
      const products = await productsService.getFeaturedProducts(limit);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ products }),
      };
    }

    // GET /products/{id} - Get single product
    if (httpMethod === 'GET' && pathParameters?.id) {
      const product = await productsService.getProduct(pathParameters.id);

      if (!product) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Product not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ product }),
      };
    }

    // POST /products - Create product (admin only)
    if (httpMethod === 'POST' && path === '/products') {
      const body = JSON.parse(event.body || '{}');
      const product = await productsService.createProduct(body);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ product }),
      };
    }

    // PUT /products/{id} - Update product (admin only)
    if (httpMethod === 'PUT' && pathParameters?.id) {
      const body = JSON.parse(event.body || '{}');
      const product = await productsService.updateProduct(pathParameters.id, body);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ product }),
      };
    }

    // DELETE /products/{id} - Delete product (admin only)
    if (httpMethod === 'DELETE' && pathParameters?.id) {
      await productsService.deleteProduct(pathParameters.id);

      return {
        statusCode: 204,
        headers,
        body: '',
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error: any) {
    console.error('Products API Error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
}
