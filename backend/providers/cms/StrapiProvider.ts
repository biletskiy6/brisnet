/**
 * Strapi CMS Provider (MOCK Implementation)
 *
 * In production, this would integrate with Strapi REST or GraphQL API
 * Strapi handles: Marketing banners, News articles, Editorial content
 *
 * NOT used for: Products, Orders, Credits (handled by custom backend)
 */

import type {
  ICMSProvider,
  MarketingBanner,
  NewsArticle,
  MenuItem,
} from './ICMSProvider.js';

export class StrapiProvider implements ICMSProvider {
  readonly name = 'strapi';

  private strapiUrl: string;
  private apiToken: string;

  constructor() {
    this.strapiUrl = process.env.STRAPI_URL || 'http://localhost:1337';
    this.apiToken = process.env.STRAPI_API_TOKEN || 'mock_token';
  }

  async getBanners(): Promise<MarketingBanner[]> {
    // MOCK: In production, call Strapi API
    // GET /api/banners?filters[isActive][$eq]=true&sort=position:asc
    console.log(`[Strapi Mock] Fetching banners from ${this.strapiUrl}`);

    return [
      {
        id: '1',
        title: 'Kentucky Derby 152 - Get Your PPs Now!',
        description: 'Ultimate Past Performances for Churchill Downs',
        imageUrl: '/images/banners/derby-2025.jpg',
        linkUrl: '/store?track=CD',
        isActive: true,
        position: 1,
      },
      {
        id: '2',
        title: 'New: Bruno\'s Power Plays',
        description: 'Expert handicapping from Bruno De Julio',
        imageUrl: '/images/banners/bruno-power-plays.jpg',
        linkUrl: '/store?creator=bruno',
        isActive: true,
        position: 2,
      },
    ];
  }

  async getArticles(params: {
    limit?: number;
    offset?: number;
    tag?: string;
  }): Promise<NewsArticle[]> {
    // MOCK: In production, call Strapi API
    // GET /api/articles?pagination[limit]=10&filters[tags][slug][$eq]=handicapping
    console.log(`[Strapi Mock] Fetching articles`, params);

    return [
      {
        id: '1',
        title: 'Handicapping Tips for the Breeders\' Cup',
        slug: 'handicapping-tips-breeders-cup-2025',
        content: '<p>Lorem ipsum dolor sit amet...</p>',
        excerpt: 'Expert tips for betting the Breeders\' Cup',
        author: 'Corby Anderson',
        publishedAt: new Date('2025-11-01'),
        featuredImage: '/images/articles/breeders-cup.jpg',
        tags: ['handicapping', 'breeders-cup', 'thoroughbred'],
      },
      {
        id: '2',
        title: 'Understanding Speed Figures',
        slug: 'understanding-speed-figures',
        content: '<p>Speed figures are a critical tool...</p>',
        excerpt: 'A beginner\'s guide to speed figures',
        author: 'Ashley Thompson',
        publishedAt: new Date('2025-10-15'),
        tags: ['education', 'speed-figures'],
      },
    ];
  }

  async getArticle(slug: string): Promise<NewsArticle | null> {
    // MOCK: Fetch single article
    console.log(`[Strapi Mock] Fetching article: ${slug}`);

    const articles = await this.getArticles({});
    return articles.find((a) => a.slug === slug) || null;
  }

  async getMenuItems(menuLocation: string): Promise<MenuItem[]> {
    // MOCK: Fetch menu structure
    console.log(`[Strapi Mock] Fetching menu: ${menuLocation}`);

    if (menuLocation === 'main') {
      return [
        { id: '1', label: 'Store', url: '/store', order: 1 },
        { id: '2', label: 'News', url: '/news', order: 2 },
        { id: '3', label: 'Handicapping Tools', url: '/tools', order: 3 },
        { id: '4', label: 'About', url: '/about', order: 4 },
      ];
    }

    return [];
  }

  async getContent(contentType: string, slug: string): Promise<any> {
    // MOCK: Generic content fetcher
    console.log(`[Strapi Mock] Fetching ${contentType} with slug: ${slug}`);

    // In production: GET /api/${contentType}?filters[slug][$eq]=${slug}
    return {
      id: '1',
      slug,
      contentType,
      data: { message: 'Mock content from Strapi' },
    };
  }

  // Helper method to call actual Strapi API (for production)
  private async fetchFromStrapi(endpoint: string): Promise<any> {
    const url = `${this.strapiUrl}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };

    // In production:
    // const response = await fetch(url, { headers });
    // return response.json();

    console.log(`Would fetch from: ${url}`);
    return { data: [] };
  }
}
