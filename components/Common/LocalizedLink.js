import Link from 'next/link';
import { useRouter } from 'next/router';
import { validateAndFixUrl } from '../../lib/url-validator';

/**
 * LocalizedLink Component
 * A wrapper around Next.js Link that ensures proper locale handling
 * Prevents duplicate locale paths and other URL issues
 */
export default function LocalizedLink({ href, locale, children, ...props }) {
  const router = useRouter();
  const currentLocale = locale || router.locale || 'en';

  // If href is an external URL, pass through unchanged
  if (
    typeof href === 'string' &&
    (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//'))
  ) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  // For internal links, validate and fix the URL
  const validatedHref = typeof href === 'string' ? validateAndFixUrl(href, currentLocale) : href;

  // For non-English locales, use Next.js locale prop
  // For English, use the path without locale prefix
  if (currentLocale === 'en') {
    return (
      <Link href={validatedHref} locale="en" {...props}>
        {children}
      </Link>
    );
  }

  // For other locales, let Next.js handle the locale prefix
  // Remove any locale from the path as Next.js will add it
  const pathWithoutLocale =
    typeof validatedHref === 'string'
      ? validatedHref.replace(new RegExp(`^/${currentLocale}/`), '/')
      : validatedHref;

  return (
    <Link href={pathWithoutLocale} locale={currentLocale} {...props}>
      {children}
    </Link>
  );
}
