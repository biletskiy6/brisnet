/**
 * CMS Provider Interface
 * Abstraction layer for content management systems (Strapi, Custom, etc.)
 *
 * Note: This is ONLY for marketing/editorial content, NOT e-commerce products
 */

export interface MarketingBanner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  position: number; // For ordering
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string; // Rich text (HTML or Markdown)
  excerpt?: string;
  author: string;
  publishedAt: Date;
  featuredImage?: string;
  tags: string[];
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  parent?: string; // For nested menus
  children?: MenuItem[];
}

export interface ICMSProvider {
  /**
   * Provider name
   */
  readonly name: string;

  /**
   * Get active marketing banners
   */
  getBanners(): Promise<MarketingBanner[]>;

  /**
   * Get news articles (paginated)
   */
  getArticles(params: { limit?: number; offset?: number; tag?: string }): Promise<NewsArticle[]>;

  /**
   * Get single article by slug
   */
  getArticle(slug: string): Promise<NewsArticle | null>;

  /**
   * Get navigation menu items
   */
  getMenuItems(menuLocation: string): Promise<MenuItem[]>;

  /**
   * Get generic content by type and slug
   */
  getContent(contentType: string, slug: string): Promise<any>;
}
