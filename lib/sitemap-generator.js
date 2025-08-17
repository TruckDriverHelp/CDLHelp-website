/**
 * Sitemap Generator for CDL Help
 * Handles pagination and validation of sitemaps
 */

class SitemapGenerator {
  constructor(maxUrlsPerSitemap = 45000) {
    this.maxUrls = maxUrlsPerSitemap;
    this.sitemaps = [];
  }

  /**
   * Generate paginated sitemaps from URLs
   */
  async generatePaginatedSitemaps(urls, baseFileName) {
    const chunks = this.chunkArray(urls, this.maxUrls);
    const sitemapFiles = [];

    for (let i = 0; i < chunks.length; i++) {
      const fileName = chunks.length > 1 ? `${baseFileName}-${i + 1}.xml` : `${baseFileName}.xml`;

      const sitemap = this.buildSitemap(chunks[i]);
      sitemapFiles.push({
        fileName,
        content: sitemap,
        urlCount: chunks[i].length,
      });
    }

    return sitemapFiles;
  }

  /**
   * Build XML sitemap from URLs
   */
  buildSitemap(urls) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    urls.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(url.loc)}</loc>\n`;

      if (url.lastmod) {
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }

      if (url.changefreq) {
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }

      if (url.priority !== undefined) {
        xml += `    <priority>${url.priority}</priority>\n`;
      }

      // Add hreflang alternates if provided
      if (url.alternates && url.alternates.length > 0) {
        url.alternates.forEach(alt => {
          xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${this.escapeXml(
            alt.href
          )}"/>\n`;
        });
      }

      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Build image sitemap
   */
  buildImageSitemap(pageImages) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

    Object.entries(pageImages).forEach(([pageUrl, images]) => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(pageUrl)}</loc>\n`;

      // Max 1000 images per page
      images.slice(0, 1000).forEach(img => {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${this.escapeXml(img.url)}</image:loc>\n`;

        if (img.caption) {
          xml += `      <image:caption><![CDATA[${img.caption}]]></image:caption>\n`;
        }

        if (img.title) {
          xml += `      <image:title><![CDATA[${img.title}]]></image:title>\n`;
        }

        if (img.geoLocation) {
          xml += `      <image:geo_location>${this.escapeXml(img.geoLocation)}</image:geo_location>\n`;
        }

        if (img.license) {
          xml += `      <image:license>${this.escapeXml(img.license)}</image:license>\n`;
        }

        xml += '    </image:image>\n';
      });

      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Build video sitemap
   */
  buildVideoSitemap(videos, siteUrl) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

    videos.forEach(video => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(siteUrl + video.pageUrl)}</loc>\n`;
      xml += '    <video:video>\n';

      // Required fields
      xml += `      <video:thumbnail_loc>${this.escapeXml(
        video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : siteUrl + video.thumbnailUrl
      )}</video:thumbnail_loc>\n`;
      xml += `      <video:title><![CDATA[${video.title}]]></video:title>\n`;
      xml += `      <video:description><![CDATA[${video.description}]]></video:description>\n`;

      // Content or player location
      if (video.contentUrl) {
        xml += `      <video:content_loc>${this.escapeXml(video.contentUrl)}</video:content_loc>\n`;
      } else if (video.playerUrl) {
        xml += `      <video:player_loc>${this.escapeXml(video.playerUrl)}</video:player_loc>\n`;
      }

      // Optional fields
      if (video.duration) {
        xml += `      <video:duration>${video.duration}</video:duration>\n`;
      }

      if (video.publicationDate) {
        xml += `      <video:publication_date>${video.publicationDate}</video:publication_date>\n`;
      }

      if (video.expirationDate) {
        xml += `      <video:expiration_date>${video.expirationDate}</video:expiration_date>\n`;
      }

      if (video.rating !== undefined) {
        xml += `      <video:rating>${video.rating}</video:rating>\n`;
      }

      if (video.viewCount !== undefined) {
        xml += `      <video:view_count>${video.viewCount}</video:view_count>\n`;
      }

      if (video.familyFriendly !== undefined) {
        xml += `      <video:family_friendly>${video.familyFriendly ? 'yes' : 'no'}</video:family_friendly>\n`;
      }

      if (video.restriction) {
        xml += `      <video:restriction relationship="${video.restriction.relationship}">${video.restriction.countries}</video:restriction>\n`;
      }

      if (video.platform) {
        xml += `      <video:platform relationship="${video.platform.relationship}">${video.platform.types}</video:platform>\n`;
      }

      if (video.requiresSubscription !== undefined) {
        xml += `      <video:requires_subscription>${
          video.requiresSubscription ? 'yes' : 'no'
        }</video:requires_subscription>\n`;
      }

      if (video.uploader) {
        xml += `      <video:uploader info="${this.escapeXml(video.uploader.info || '')}">${this.escapeXml(
          video.uploader.name
        )}</video:uploader>\n`;
      }

      if (video.live !== undefined) {
        xml += `      <video:live>${video.live ? 'yes' : 'no'}</video:live>\n`;
      }

      if (video.tags && video.tags.length > 0) {
        video.tags.slice(0, 32).forEach(tag => {
          xml += `      <video:tag>${this.escapeXml(tag)}</video:tag>\n`;
        });
      }

      if (video.category) {
        xml += `      <video:category>${this.escapeXml(video.category)}</video:category>\n`;
      }

      xml += '    </video:video>\n';
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Build news sitemap
   */
  buildNewsSitemap(articles, siteUrl) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

    articles.forEach(article => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(siteUrl + article.url)}</loc>\n`;
      xml += '    <news:news>\n';
      xml += '      <news:publication>\n';
      xml += `        <news:name>${this.escapeXml(article.publicationName || 'CDL Help News')}</news:name>\n`;
      xml += `        <news:language>${article.language || 'en'}</news:language>\n`;
      xml += '      </news:publication>\n';

      // Publication date (required)
      xml += `      <news:publication_date>${article.publicationDate}</news:publication_date>\n`;

      // Title (required)
      xml += `      <news:title><![CDATA[${article.title}]]></news:title>\n`;

      // Optional fields
      if (article.keywords && article.keywords.length > 0) {
        xml += `      <news:keywords>${this.escapeXml(article.keywords.slice(0, 10).join(', '))}</news:keywords>\n`;
      }

      if (article.stockTickers) {
        xml += `      <news:stock_tickers>${this.escapeXml(article.stockTickers)}</news:stock_tickers>\n`;
      }

      xml += '    </news:news>\n';
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Split array into chunks
   */
  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Escape XML special characters
   */
  escapeXml(str) {
    if (!str) return '';
    return str
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Validate sitemap against Google's requirements
   */
  validateSitemap(xml) {
    const errors = [];

    // Check URL count (max 50,000)
    const urlCount = (xml.match(/<url>/g) || []).length;
    if (urlCount > 50000) {
      errors.push(`Sitemap exceeds 50,000 URL limit: ${urlCount} URLs`);
    }

    // Check file size (max 50MB uncompressed)
    const sizeInMB = Buffer.byteLength(xml, 'utf8') / 1024 / 1024;
    if (sizeInMB > 50) {
      errors.push(`Sitemap exceeds 50MB limit: ${sizeInMB.toFixed(2)}MB`);
    }

    // Check for required namespaces
    if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
      errors.push('Missing required sitemap namespace');
    }

    // Check for valid XML declaration
    if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
      errors.push('Invalid or missing XML declaration');
    }

    return {
      valid: errors.length === 0,
      errors,
      stats: {
        urlCount,
        sizeInMB: sizeInMB.toFixed(2),
      },
    };
  }
}

module.exports = SitemapGenerator;
