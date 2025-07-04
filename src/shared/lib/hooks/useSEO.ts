import { useRouter } from 'next/router';

interface SEOData {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article';
}

interface UseSEOOptions {
  meta?: any;
  customUrl?: string;
  type?: 'website' | 'article';
  image?: string;
}

export const useSEO = (options: UseSEOOptions = {}): SEOData => {
  const router = useRouter();
  const { meta, customUrl, type = 'website', image } = options;

  const baseUrl = 'https://www.cdlhelp.com';
  const currentUrl = customUrl || `${baseUrl}${router.asPath}`;

  return {
    title: meta?.title || 'CDL Help',
    description:
      meta?.description || 'Your trusted partner for CDL training and career opportunities',
    url: currentUrl,
    image: image || '/images/truckdriverhelp-og.jpg',
    type,
  };
};
