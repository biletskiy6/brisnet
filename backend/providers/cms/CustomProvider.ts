/**
 * Custom CMS Provider (MOCK Implementation)
 *
 * Simple in-memory/file-based CMS alternative to Strapi
 * Useful for development or if we want full control without external dependency
 */

import type {
  ICMSProvider,
  MarketingBanner,
  NewsArticle,
  MenuItem,
} from './ICMSProvider.js';

export class CustomProvider implements ICMSProvider {
  readonly name = 'custom';

  // Mock in-memory data
  private banners: MarketingBanner[] = [
    {
      id: 'banner-1',
      title: '🏇 Triple Crown Season - Save 20%',
      description: 'Get all our PPs for Kentucky Derby, Preakness, and Belmont',
      imageUrl: '/images/triple-crown-banner.jpg',
      linkUrl: '/store?promo=TRIPLE20',
      isActive: true,
      position: 1,
    },
    {
      id: 'banner-2',
      title: 'New: E-Ponies International Coverage',
      description: 'Now covering UK, Australia, and Europe races',
      imageUrl: '/images/international-banner.jpg',
      linkUrl: '/store?tag=international',
      isActive: true,
      position: 2,
    },
  ];

  private articles: NewsArticle[] = [
    {
      id: 'article-1',
      title: 'Top 10 Kentucky Derby Contenders',
      slug: 'top-10-derby-contenders-2025',
      content: `
        <h2>Analyzing the 2025 Kentucky Derby Field</h2>
        <p>As we approach the 152nd running of the Kentucky Derby,
        here are the top contenders to watch...</p>
        <ol>
          <li><strong>Midnight Thunder</strong> - Undefeated in 5 starts</li>
          <li><strong>Golden Prospect</strong> - Strong closer with stamina</li>
        </ol>
      `,
      excerpt: 'Expert analysis of the top Derby contenders',
      author: 'Corby Anderson',
      publishedAt: new Date('2025-04-15'),
      featuredImage: '/images/derby-2025.jpg',
      tags: ['kentucky-derby', 'handicapping', 'thoroughbred'],
    },
    {
      id: 'article-2',
      title: 'How to Read Past Performances Like a Pro',
      slug: 'how-to-read-past-performances',
      content: `
        <h2>Mastering Past Performances</h2>
        <p>Past performances (PPs) are the handicapper's most important tool.
        Here's what to look for...</p>
      `,
      excerpt: 'A beginner-friendly guide to reading PPs',
      author: 'Ashley Thompson',
      publishedAt: new Date('2025-03-20'),
      tags: ['education', 'handicapping', 'past-performances'],
    },
  ];

  private menus: Record<string, MenuItem[]> = {
    main: [
      { id: 'm1', label: 'Shop', url: '/store', order: 1 },
      { id: 'm2', label: 'News & Analysis', url: '/news', order: 2 },
      { id: 'm3', label: 'My Account', url: '/account', order: 3 },
      { id: 'm4', label: 'Help', url: '/help', order: 4 },
    ],
    footer: [
      { id: 'f1', label: 'About Brisnet', url: '/about', order: 1 },
      { id: 'f2', label: 'Contact Us', url: '/contact', order: 2 },
      { id: 'f3', label: 'Terms of Service', url: '/terms', order: 3 },
      { id: 'f4', label: 'Privacy Policy', url: '/privacy', order: 4 },
    ],
  };

  async getBanners(): Promise<MarketingBanner[]> {
    console.log('[Custom CMS] Fetching banners from in-memory store');

    // Filter active banners
    return this.banners
      .filter((b) => b.isActive)
      .sort((a, b) => a.position - b.position);
  }

  async getArticles(params: {
    limit?: number;
    offset?: number;
    tag?: string;
  }): Promise<NewsArticle[]> {
    console.log('[Custom CMS] Fetching articles', params);

    let filtered = [...this.articles];

    // Filter by tag if specified
    if (params.tag) {
      filtered = filtered.filter((a) => a.tags.includes(params.tag!));
    }

    // Sort by published date (newest first)
    filtered.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    // Apply pagination
    const offset = params.offset || 0;
    const limit = params.limit || 10;

    return filtered.slice(offset, offset + limit);
  }

  async getArticle(slug: string): Promise<NewsArticle | null> {
    console.log(`[Custom CMS] Fetching article: ${slug}`);
    return this.articles.find((a) => a.slug === slug) || null;
  }

  async getMenuItems(menuLocation: string): Promise<MenuItem[]> {
    console.log(`[Custom CMS] Fetching menu: ${menuLocation}`);
    return this.menus[menuLocation] || [];
  }

  async getContent(contentType: string, slug: string): Promise<any> {
    console.log(`[Custom CMS] Fetching ${contentType} with slug: ${slug}`);

    // Mock generic content
    return {
      id: `${contentType}-${slug}`,
      contentType,
      slug,
      data: {
        title: `Custom ${contentType} content`,
        message: 'This is mock content from the custom provider',
      },
    };
  }

  // Helper methods for managing content (admin features)
  addBanner(banner: MarketingBanner): void {
    this.banners.push(banner);
  }

  addArticle(article: NewsArticle): void {
    this.articles.push(article);
  }
}
