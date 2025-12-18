/**
 * Products Service
 * Business logic for product catalog management
 */

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface ProductFilters {
  tracks?: string[];
  productTypes?: string[];
  creators?: string[];
  searchQuery?: string;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export class ProductsService {
  /**
   * Get all products with optional filtering
   */
  async getProducts(filters?: ProductFilters) {
    const where: Prisma.ProductWhereInput = {};

    if (filters?.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.cashPrice = {};
      if (filters.minPrice) {
        where.cashPrice.gte = filters.minPrice;
      }
      if (filters.maxPrice) {
        where.cashPrice.lte = filters.maxPrice;
      }
    }

    if (filters?.searchQuery) {
      where.OR = [
        { name: { contains: filters.searchQuery } },
        { description: { contains: filters.searchQuery } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { popularity: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Filter by tags (stored as JSON)
    let filtered = products;

    if (filters?.tracks && filters.tracks.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags as any;
        return filters.tracks!.includes(tags?.track);
      });
    }

    if (filters?.productTypes && filters.productTypes.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags as any;
        return filters.productTypes!.includes(tags?.productType);
      });
    }

    if (filters?.creators && filters.creators.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags as any;
        return filters.creators!.includes(tags?.creator);
      });
    }

    return filtered;
  }

  /**
   * Get single product by ID
   */
  async getProduct(id: string) {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 10) {
    return prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: { popularity: 'desc' },
      take: limit,
    });
  }

  /**
   * Create a new product
   */
  async createProduct(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
    });
  }

  /**
   * Update a product
   */
  async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }

  /**
   * Increment product popularity (when purchased)
   */
  async incrementPopularity(id: string) {
    return prisma.product.update({
      where: { id },
      data: {
        popularity: {
          increment: 1,
        },
      },
    });
  }
}

export const productsService = new ProductsService();
