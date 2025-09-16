const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

/**
 * Website Page Analyzer for CDLHelp
 * Analyzes all pages including static, dynamic, and locale variations
 */

class WebsitePageAnalyzer {
  constructor() {
    this.locales = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
    this.defaultLocale = 'en';
    this.pagesDir = path.join(process.cwd(), 'pages');
    this.publicDir = path.join(process.cwd(), 'public');
    this.analysis = {
      staticPages: {},
      dynamicRoutes: {},
      apiRoutes: [],
      localeAvailability: {},
      strapiContent: {
        blogs: [],
        schools: [],
        companies: [],
      },
      totalPages: 0,
      issues: [],
    };
  }

  async analyze() {
    console.log('🔍 Starting Website Page Analysis...\n');

    await this.analyzeStaticPages();
    await this.analyzeDynamicRoutes();
    await this.analyzeLocaleAvailability();
    await this.analyzeStrapiContent();
    await this.generateReport();

    return this.analysis;
  }

  async analyzeStaticPages() {
    console.log('📄 Analyzing static pages...');

    const pageFiles = await glob('**/*.{js,jsx,tsx,ts}', {
      cwd: this.pagesDir,
      ignore: ['_app.js', '_document.js', '_error.js', 'api/**', '**/*.test.*'],
    });

    for (const file of pageFiles) {
      const pagePath = this.fileToRoute(file);

      // Skip dynamic routes for now
      if (pagePath.includes('[') || pagePath.includes(']')) {
        continue;
      }

      // Check if it's an API route
      if (file.startsWith('api/')) {
        this.analysis.apiRoutes.push(pagePath);
        continue;
      }

      // Analyze static page
      this.analysis.staticPages[pagePath] = {
        file,
        path: pagePath,
        availableLocales: [],
        hasGetStaticProps: await this.checkForGetStaticProps(file),
        hasGetServerSideProps: await this.checkForGetServerSideProps(file),
      };
    }

    console.log(`  ✓ Found ${Object.keys(this.analysis.staticPages).length} static pages`);
  }

  async analyzeDynamicRoutes() {
    console.log('🔄 Analyzing dynamic routes...');

    const dynamicFiles = await glob('**/*\\[*\\]*.{js,jsx,tsx,ts}', {
      cwd: this.pagesDir,
      ignore: ['api/**', '**/*.test.*'],
    });

    for (const file of dynamicFiles) {
      const routePattern = this.fileToRoute(file);

      this.analysis.dynamicRoutes[routePattern] = {
        file,
        pattern: routePattern,
        parameters: this.extractDynamicParams(routePattern),
        isOptional: routePattern.includes('[['),
        isCatchAll: routePattern.includes('...'),
        requiresData: true,
      };
    }

    console.log(`  ✓ Found ${Object.keys(this.analysis.dynamicRoutes).length} dynamic routes`);
  }

  async analyzeLocaleAvailability() {
    console.log('🌍 Analyzing locale availability...');

    // Check each static page for locale availability
    for (const [pagePath, pageInfo] of Object.entries(this.analysis.staticPages)) {
      const availableLocales = await this.checkLocaleAvailability(pagePath);
      pageInfo.availableLocales = availableLocales;

      // Track locale-specific availability
      if (!this.analysis.localeAvailability[pagePath]) {
        this.analysis.localeAvailability[pagePath] = {};
      }

      for (const locale of this.locales) {
        this.analysis.localeAvailability[pagePath][locale] = availableLocales.includes(locale);
      }
    }

    // Identify pages with missing locales
    for (const [pagePath, locales] of Object.entries(this.analysis.localeAvailability)) {
      const missingLocales = this.locales.filter(locale => !locales[locale]);
      if (missingLocales.length > 0 && missingLocales.length < this.locales.length) {
        this.analysis.issues.push({
          type: 'missing-locales',
          page: pagePath,
          missingLocales,
        });
      }
    }

    console.log(
      `  ✓ Analyzed locale availability for ${Object.keys(this.analysis.localeAvailability).length} pages`
    );
  }

  async analyzeStrapiContent() {
    console.log('📦 Analyzing Strapi dynamic content...');

    try {
      // Check for Strapi API configuration
      const strapiConfig = await this.getStrapiConfig();

      if (strapiConfig) {
        // Analyze blog posts
        if (await this.checkFileExists('pages/blog/[slug].js')) {
          this.analysis.strapiContent.blogs = {
            route: '/blog/[slug]',
            estimatedCount: 'dynamic',
            requiresAPI: true,
            localized: true,
          };
        }

        // Analyze schools
        if (await this.checkFileExists('pages/schools/[state]/[city].js')) {
          this.analysis.strapiContent.schools = {
            route: '/schools/[state]/[city]',
            estimatedCount: 'dynamic',
            requiresAPI: true,
            localized: false,
          };
        }

        // Analyze companies
        if (await this.checkFileExists('pages/companies/[slug].js')) {
          this.analysis.strapiContent.companies = {
            route: '/companies/[slug]',
            estimatedCount: 'dynamic',
            requiresAPI: true,
            localized: true,
          };
        }
      }
    } catch (error) {
      console.log('  ⚠ Could not analyze Strapi content:', error.message);
    }

    console.log(`  ✓ Analyzed Strapi content sources`);
  }

  async generateReport() {
    console.log('\n📊 Generating analysis report...');

    // Calculate totals
    const staticPageCount = Object.keys(this.analysis.staticPages).length;
    const dynamicRouteCount = Object.keys(this.analysis.dynamicRoutes).length;
    const apiRouteCount = this.analysis.apiRoutes.length;

    // Estimate total pages with locales
    let totalEstimatedPages = 0;
    for (const [pagePath, pageInfo] of Object.entries(this.analysis.staticPages)) {
      const localeCount = pageInfo.availableLocales.length || this.locales.length;
      totalEstimatedPages += localeCount;
    }

    this.analysis.totalPages = totalEstimatedPages;
    this.analysis.summary = {
      staticPages: staticPageCount,
      dynamicRoutes: dynamicRouteCount,
      apiRoutes: apiRouteCount,
      totalEstimatedPages,
      localesSupported: this.locales.length,
      issuesFound: this.analysis.issues.length,
    };

    // Write report to file
    const reportPath = path.join(process.cwd(), 'sitemap-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.analysis, null, 2));

    console.log(`  ✓ Report saved to ${reportPath}`);
    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📈 ANALYSIS SUMMARY');
    console.log('='.repeat(60));
    console.log(`Static Pages: ${this.analysis.summary.staticPages}`);
    console.log(`Dynamic Routes: ${this.analysis.summary.dynamicRoutes}`);
    console.log(`API Routes: ${this.analysis.summary.apiRoutes}`);
    console.log(`Supported Locales: ${this.analysis.summary.localesSupported}`);
    console.log(`Estimated Total Pages: ${this.analysis.summary.totalEstimatedPages}`);

    if (this.analysis.issues.length > 0) {
      console.log(`\n⚠ Issues Found: ${this.analysis.issues.length}`);
      this.analysis.issues.slice(0, 5).forEach(issue => {
        console.log(
          `  - ${issue.type}: ${issue.page} (${issue.missingLocales?.join(', ') || 'N/A'})`
        );
      });
      if (this.analysis.issues.length > 5) {
        console.log(`  ... and ${this.analysis.issues.length - 5} more`);
      }
    }

    console.log('\n' + '='.repeat(60));
  }

  // Helper methods
  fileToRoute(file) {
    let route = file
      .replace(/\.(js|jsx|ts|tsx)$/, '')
      .replace(/\/index$/, '')
      .replace(/^index$/, '/');

    if (route === '') route = '/';
    if (route !== '/' && !route.startsWith('/')) route = '/' + route;

    return route;
  }

  extractDynamicParams(route) {
    const params = [];
    const regex = /\[([^\]]+)\]/g;
    let match;

    while ((match = regex.exec(route)) !== null) {
      params.push({
        name: match[1].replace('...', ''),
        isCatchAll: match[1].startsWith('...'),
        isOptional: route.includes(`[[${match[1]}]]`),
      });
    }

    return params;
  }

  async checkForGetStaticProps(file) {
    try {
      const filePath = path.join(this.pagesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      return content.includes('getStaticProps');
    } catch {
      return false;
    }
  }

  async checkForGetServerSideProps(file) {
    try {
      const filePath = path.join(this.pagesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      return content.includes('getServerSideProps');
    } catch {
      return false;
    }
  }

  async checkLocaleAvailability(pagePath) {
    const availableLocales = [];

    // Check for locale-specific content or translations
    for (const locale of this.locales) {
      const translationFile = path.join(
        this.publicDir,
        'locales',
        locale,
        `${pagePath === '/' ? 'common' : pagePath.slice(1).replace(/\//g, '-')}.json`
      );

      // For now, assume all locales are available unless we find specific restrictions
      // In production, you'd check actual translation files or CMS data
      availableLocales.push(locale);
    }

    return availableLocales;
  }

  async checkFileExists(filePath) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      return fs.existsSync(fullPath);
    } catch {
      return false;
    }
  }

  async getStrapiConfig() {
    try {
      // Check for Strapi environment variables
      return {
        host: process.env.STRAPI_HOST || '146.190.47.164',
        port: process.env.STRAPI_PORT || '1337',
        apiKey: process.env.STRAPI_API_KEY ? 'configured' : 'missing',
      };
    } catch {
      return null;
    }
  }
}

// Run the analyzer
if (require.main === module) {
  const analyzer = new WebsitePageAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = WebsitePageAnalyzer;
