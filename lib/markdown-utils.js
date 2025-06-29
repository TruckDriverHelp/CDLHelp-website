// Utility functions for processing markdown content

/**
 * Transform links in markdown to fix common issues:
 * - Remove domain from internal links
 * - Add mailto: to email links
 * - Fix relative URLs
 */
export function createLinkTransformer() {
  return {
    link: (href, text, title) => {
      let transformedHref = href;
      
      // Fix internal links that include the domain
      if (href && (href.includes('www.cdlhelp.com') || href.includes('www.CDLhelp.com'))) {
        // Extract the path part only
        const match = href.match(/(?:https?:\/\/)?(?:www\.)?cdlhelp\.com(.*)$/i);
        if (match && match[1]) {
          transformedHref = match[1] || '/';
        }
      }
      
      // Fix email links without mailto:
      if (href && href.includes('@') && !href.startsWith('mailto:') && !href.startsWith('http')) {
        transformedHref = `mailto:${href}`;
      }
      
      // Fix links that start with domain without protocol
      if (href && (href.startsWith('cdlhelp.com') || href.startsWith('CDLhelp.com'))) {
        const path = href.substring(href.indexOf('/') > -1 ? href.indexOf('/') : href.length);
        transformedHref = path || '/';
      }
      
      // Remove any double slashes (except after protocol)
      if (transformedHref && !transformedHref.startsWith('http')) {
        transformedHref = transformedHref.replace(/\/+/g, '/');
      }
      
      return {
        href: transformedHref,
        text,
        title
      };
    }
  };
}

/**
 * Custom link renderer for ReactMarkdown
 */
export function LinkRenderer({ href, children }) {
  let processedHref = href;
  
  // Fix internal links that include the domain
  if (href && (href.includes('www.cdlhelp.com') || href.includes('www.CDLhelp.com'))) {
    const match = href.match(/(?:https?:\/\/)?(?:www\.)?cdlhelp\.com(.*)$/i);
    if (match && match[1]) {
      processedHref = match[1] || '/';
    }
  }
  
  // Fix email links without mailto:
  if (href && href.includes('@') && !href.startsWith('mailto:') && !href.startsWith('http')) {
    processedHref = `mailto:${href}`;
  }
  
  // Fix links that start with domain without protocol
  if (href && (href.startsWith('cdlhelp.com') || href.startsWith('CDLhelp.com'))) {
    const path = href.substring(href.indexOf('/') > -1 ? href.indexOf('/') : href.length);
    processedHref = path || '/';
  }
  
  // Remove any double slashes (except after protocol)
  if (processedHref && !processedHref.startsWith('http')) {
    processedHref = processedHref.replace(/\/+/g, '/');
  }
  
  return <a href={processedHref}>{children}</a>;
}