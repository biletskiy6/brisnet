/**
 * CMS Provider Factory
 * Dynamically loads the correct CMS provider based on environment
 */

import type { ICMSProvider } from './ICMSProvider.js';
import { StrapiProvider } from './StrapiProvider.js';
import { CustomProvider } from './CustomProvider.js';

export * from './ICMSProvider.js';
export * from './StrapiProvider.js';
export * from './CustomProvider.js';

/**
 * Get the active CMS provider based on environment configuration
 */
export function getCMSProvider(): ICMSProvider {
  const provider = process.env.CMS_PROVIDER || 'custom';

  switch (provider.toLowerCase()) {
    case 'strapi':
      console.log('📝 Using Strapi CMS provider');
      return new StrapiProvider();

    case 'custom':
      console.log('📝 Using Custom CMS provider');
      return new CustomProvider();

    default:
      console.warn(`⚠️  Unknown CMS provider: ${provider}, defaulting to Custom`);
      return new CustomProvider();
  }
}
