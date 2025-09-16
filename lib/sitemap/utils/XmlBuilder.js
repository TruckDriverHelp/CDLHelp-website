/**
 * XML Builder for sitemap generation
 */

class XmlBuilder {
  constructor(config = {}) {
    this.prettyPrint = config.prettyPrint || process.env.NODE_ENV !== 'production';
    this.xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  }

  /**
   * Build sitemap XML from URL entries
   */
  buildSitemap(urls) {
    const urlEntries = urls.map(url => this.buildUrlEntry(url)).join('\n');

    const xml = `${this.xmlHeader}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlEntries}
</urlset>`;

    return this.prettyPrint ? this.formatXml(xml) : xml;
  }

  /**
   * Build a single URL entry
   */
  buildUrlEntry(url) {
    let entry = '  <url>\n';

    // Required: loc
    entry += `    <loc>${this.escape(url.loc)}</loc>\n`;

    // Optional: lastmod
    if (url.lastmod) {
      const lastmod = this.formatDate(url.lastmod);
      entry += `    <lastmod>${lastmod}</lastmod>\n`;
    }

    // Optional: changefreq
    if (url.changefreq) {
      entry += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }

    // Optional: priority
    if (url.priority !== undefined) {
      entry += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    }

    // Optional: hreflang alternates
    if (url.alternates && url.alternates.length > 0) {
      for (const alternate of url.alternates) {
        entry += `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${this.escape(alternate.href)}"/>\n`;
      }
    }

    // Optional: images
    if (url.images && url.images.length > 0) {
      for (const image of url.images) {
        entry += this.buildImageEntry(image);
      }
    }

    // Optional: videos
    if (url.videos && url.videos.length > 0) {
      for (const video of url.videos) {
        entry += this.buildVideoEntry(video);
      }
    }

    entry += '  </url>';
    return entry;
  }

  /**
   * Build sitemap index XML
   */
  buildSitemapIndex(sitemaps) {
    const sitemapEntries = sitemaps.map(sitemap => this.buildSitemapEntry(sitemap)).join('\n');

    const xml = `${this.xmlHeader}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;

    return this.prettyPrint ? this.formatXml(xml) : xml;
  }

  /**
   * Build a single sitemap entry for index
   */
  buildSitemapEntry(sitemap) {
    let entry = '  <sitemap>\n';
    entry += `    <loc>${this.escape(sitemap.loc)}</loc>\n`;

    if (sitemap.lastmod) {
      const lastmod = this.formatDate(sitemap.lastmod);
      entry += `    <lastmod>${lastmod}</lastmod>\n`;
    }

    entry += '  </sitemap>';
    return entry;
  }

  /**
   * Build image entry
   */
  buildImageEntry(image) {
    let entry = '    <image:image>\n';
    entry += `      <image:loc>${this.escape(image.loc)}</image:loc>\n`;

    if (image.caption) {
      entry += `      <image:caption>${this.escape(image.caption)}</image:caption>\n`;
    }

    if (image.title) {
      entry += `      <image:title>${this.escape(image.title)}</image:title>\n`;
    }

    if (image.geo_location) {
      entry += `      <image:geo_location>${this.escape(image.geo_location)}</image:geo_location>\n`;
    }

    entry += '    </image:image>\n';
    return entry;
  }

  /**
   * Build video entry
   */
  buildVideoEntry(video) {
    let entry = '    <video:video>\n';
    entry += `      <video:thumbnail_loc>${this.escape(video.thumbnail_loc)}</video:thumbnail_loc>\n`;
    entry += `      <video:title>${this.escape(video.title)}</video:title>\n`;
    entry += `      <video:description>${this.escape(video.description)}</video:description>\n`;

    if (video.content_loc) {
      entry += `      <video:content_loc>${this.escape(video.content_loc)}</video:content_loc>\n`;
    }

    if (video.player_loc) {
      entry += `      <video:player_loc>${this.escape(video.player_loc)}</video:player_loc>\n`;
    }

    if (video.duration) {
      entry += `      <video:duration>${video.duration}</video:duration>\n`;
    }

    if (video.expiration_date) {
      entry += `      <video:expiration_date>${this.formatDate(video.expiration_date)}</video:expiration_date>\n`;
    }

    if (video.rating) {
      entry += `      <video:rating>${video.rating}</video:rating>\n`;
    }

    if (video.view_count) {
      entry += `      <video:view_count>${video.view_count}</video:view_count>\n`;
    }

    if (video.publication_date) {
      entry += `      <video:publication_date>${this.formatDate(video.publication_date)}</video:publication_date>\n`;
    }

    if (video.family_friendly !== undefined) {
      entry += `      <video:family_friendly>${video.family_friendly ? 'yes' : 'no'}</video:family_friendly>\n`;
    }

    if (video.tags && video.tags.length > 0) {
      for (const tag of video.tags.slice(0, 32)) {
        // Max 32 tags
        entry += `      <video:tag>${this.escape(tag)}</video:tag>\n`;
      }
    }

    entry += '    </video:video>\n';
    return entry;
  }

  /**
   * Escape special XML characters
   */
  escape(str) {
    if (!str) return '';

    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Format date to W3C format (YYYY-MM-DD or full ISO)
   */
  formatDate(date) {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    // Use ISO string for full datetime
    return d.toISOString().split('.')[0] + '+00:00';
  }

  /**
   * Format XML with proper indentation (for development)
   */
  formatXml(xml) {
    // Simple formatting for readability
    return xml
      .replace(/></g, '>\n<')
      .replace(/(<[^/>]+>)\n(<)/g, '$1$2')
      .split('\n')
      .map(line => {
        const depth =
          (line.match(/^<\//g) || []).length * -2 + (line.match(/^</g) || []).length * 2;
        return ' '.repeat(Math.max(0, depth - 2)) + line;
      })
      .join('\n')
      .trim();
  }

  /**
   * Validate XML structure
   */
  validateXml(xml) {
    // Basic validation
    const errors = [];

    // Check for XML declaration
    if (!xml.startsWith('<?xml')) {
      errors.push('Missing XML declaration');
    }

    // Check for urlset or sitemapindex
    if (!xml.includes('<urlset') && !xml.includes('<sitemapindex')) {
      errors.push('Missing root element (urlset or sitemapindex)');
    }

    // Check for proper closing tags
    const openTags = xml.match(/<([^/>]+)>/g) || [];
    const closeTags = xml.match(/<\/([^>]+)>/g) || [];

    if (openTags.length !== closeTags.length) {
      errors.push('Mismatched opening and closing tags');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

module.exports = XmlBuilder;
