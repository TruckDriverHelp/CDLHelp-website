/**
 * Heading Hierarchy Validator for CDL Help
 * Ensures proper semantic heading structure for SEO and accessibility
 */

export class HeadingValidator {
  /**
   * Validate heading hierarchy in HTML content
   */
  validateHierarchy(html) {
    const issues = [];
    const headings = this.extractHeadings(html);

    // Check for H1
    const h1Count = headings.filter(h => h.level === 1).length;
    if (h1Count === 0) {
      issues.push({
        type: 'error',
        message: 'Missing H1 tag - every page must have exactly one H1',
        seoImpact: 'high',
      });
    } else if (h1Count > 1) {
      issues.push({
        type: 'error',
        message: `Multiple H1 tags found (${h1Count}) - only one H1 allowed per page`,
        elements: headings.filter(h => h.level === 1).map(h => h.text),
        seoImpact: 'high',
      });
    }

    // Check hierarchy sequence
    let previousLevel = 0;
    const skippedLevels = [];

    headings.forEach((heading, index) => {
      // Check for skipped levels
      if (heading.level > previousLevel + 1 && previousLevel > 0) {
        skippedLevels.push({
          type: 'warning',
          message: `Skipped heading level: H${previousLevel} → H${heading.level}`,
          text: heading.text,
          position: index,
          seoImpact: 'medium',
        });
      }
      previousLevel = heading.level;
    });

    issues.push(...skippedLevels);

    // Check for empty headings
    headings.forEach(heading => {
      if (!heading.text || heading.text.trim().length === 0) {
        issues.push({
          type: 'error',
          message: `Empty H${heading.level} tag found`,
          element: heading,
          seoImpact: 'high',
        });
      }
    });

    // Check heading length (optimal for SEO)
    headings.forEach(heading => {
      if (heading.level === 1 && heading.text.length > 60) {
        issues.push({
          type: 'warning',
          message: `H1 too long (${heading.text.length} chars) - keep under 60 for optimal display`,
          text: heading.text,
          seoImpact: 'low',
        });
      }
      if (heading.level <= 3 && heading.text.length < 3) {
        issues.push({
          type: 'warning',
          message: `H${heading.level} too short - may not provide enough context`,
          text: heading.text,
          seoImpact: 'low',
        });
      }
    });

    // Check for keyword stuffing
    headings.forEach(heading => {
      const words = heading.text.toLowerCase().split(/\s+/);
      const uniqueWords = new Set(words);

      // Check for repeated words
      if (words.length > 5 && uniqueWords.size < words.length * 0.6) {
        issues.push({
          type: 'warning',
          message: `Possible keyword stuffing in H${heading.level}`,
          text: heading.text,
          seoImpact: 'medium',
        });
      }

      // Check for all caps (poor UX)
      if (heading.text === heading.text.toUpperCase() && heading.text.length > 3) {
        issues.push({
          type: 'warning',
          message: `H${heading.level} is in all caps - use CSS for styling instead`,
          text: heading.text,
          seoImpact: 'low',
        });
      }
    });

    // Check for missing IDs on important headings (for anchor links)
    const importantHeadingsWithoutIds = headings.filter(
      h => (h.level === 2 || h.level === 3) && !h.id
    );

    if (importantHeadingsWithoutIds.length > 0) {
      issues.push({
        type: 'info',
        message: `${importantHeadingsWithoutIds.length} H2/H3 headings without IDs (consider adding for anchor links)`,
        elements: importantHeadingsWithoutIds.map(h => h.text),
        seoImpact: 'low',
      });
    }

    return {
      headings,
      issues,
      valid: issues.filter(i => i.type === 'error').length === 0,
      score: this.calculateScore(issues),
      summary: this.generateSummary(headings, issues),
    };
  }

  /**
   * Extract headings from HTML
   */
  extractHeadings(html) {
    const headingRegex = /<h([1-6])(?:\s+[^>]*)?>(.*?)<\/h\1>/gi;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(html)) !== null) {
      const fullTag = match[0];
      const level = parseInt(match[1]);
      const content = match[2];

      // Extract ID if present
      const idMatch = fullTag.match(/id=["']([^"']+)["']/);
      const id = idMatch ? idMatch[1] : null;

      // Extract clean text (remove HTML tags)
      const text = content.replace(/<[^>]*>/g, '').trim();

      headings.push({
        level,
        text,
        id,
        html: fullTag,
        position: match.index,
      });
    }

    return headings;
  }

  /**
   * Fix heading hierarchy issues
   */
  fixHierarchy(headings) {
    const fixed = JSON.parse(JSON.stringify(headings)); // Deep clone
    let hasH1 = false;
    let currentMaxLevel = 0;

    fixed.forEach((heading, index) => {
      // Ensure only one H1
      if (heading.level === 1) {
        if (hasH1) {
          // Demote extra H1s to H2
          heading.level = 2;
          heading.fixed = true;
          heading.fixReason = 'Demoted from H1 (only one H1 allowed)';
        } else {
          hasH1 = true;
        }
      }

      // Fix skipped levels
      if (heading.level > currentMaxLevel + 1) {
        const oldLevel = heading.level;
        heading.level = currentMaxLevel + 1;
        heading.fixed = true;
        heading.fixReason = `Fixed skipped level (was H${oldLevel})`;
      }

      // Update current max level
      if (heading.level > currentMaxLevel) {
        currentMaxLevel = heading.level;
      }
    });

    // If no H1 exists, promote first heading to H1
    if (!hasH1 && fixed.length > 0) {
      fixed[0].level = 1;
      fixed[0].fixed = true;
      fixed[0].fixReason = 'Promoted to H1 (page needs an H1)';

      // Adjust other headings accordingly
      for (let i = 1; i < fixed.length; i++) {
        if (fixed[i].level === 1) {
          fixed[i].level = 2;
          fixed[i].fixed = true;
          fixed[i].fixReason = 'Adjusted after H1 promotion';
        }
      }
    }

    return fixed;
  }

  /**
   * Generate IDs for headings (for anchor links)
   */
  generateHeadingId(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove multiple hyphens
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .substring(0, 50); // Limit length
  }

  /**
   * Calculate SEO score based on issues
   */
  calculateScore(issues) {
    let score = 100;

    issues.forEach(issue => {
      switch (issue.seoImpact) {
        case 'high':
          score -= issue.type === 'error' ? 20 : 10;
          break;
        case 'medium':
          score -= issue.type === 'error' ? 10 : 5;
          break;
        case 'low':
          score -= issue.type === 'error' ? 5 : 2;
          break;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Generate summary of heading structure
   */
  generateSummary(headings, issues) {
    const h1Count = headings.filter(h => h.level === 1).length;
    const errorCount = issues.filter(i => i.type === 'error').length;
    const warningCount = issues.filter(i => i.type === 'warning').length;

    return {
      totalHeadings: headings.length,
      h1Count,
      h2Count: headings.filter(h => h.level === 2).length,
      h3Count: headings.filter(h => h.level === 3).length,
      deepestLevel: Math.max(...headings.map(h => h.level), 0),
      hasProperH1: h1Count === 1,
      errorCount,
      warningCount,
      hierarchyTree: this.buildHierarchyTree(headings),
    };
  }

  /**
   * Build visual hierarchy tree
   */
  buildHierarchyTree(headings) {
    return headings.map(h => {
      const indent = '  '.repeat(h.level - 1);
      const text = h.text.length > 50 ? h.text.substring(0, 47) + '...' : h.text;
      return `${indent}H${h.level}: ${text}`;
    });
  }

  /**
   * Generate report
   */
  generateReport(validationResult) {
    const { headings, issues, score, summary } = validationResult;

    let report = '# Heading Hierarchy Report\n\n';
    report += `**SEO Score:** ${score}/100\n\n`;

    // Summary
    report += '## Summary\n';
    report += `- Total Headings: ${summary.totalHeadings}\n`;
    report += `- H1 Tags: ${summary.h1Count} ${summary.hasProperH1 ? '✅' : '❌'}\n`;
    report += `- Errors: ${summary.errorCount}\n`;
    report += `- Warnings: ${summary.warningCount}\n\n`;

    // Issues
    if (issues.length > 0) {
      report += '## Issues Found\n\n';

      const errors = issues.filter(i => i.type === 'error');
      if (errors.length > 0) {
        report += '### Errors (Must Fix)\n';
        errors.forEach(issue => {
          report += `- ❌ ${issue.message}\n`;
          if (issue.text) report += `  Text: "${issue.text}"\n`;
        });
        report += '\n';
      }

      const warnings = issues.filter(i => i.type === 'warning');
      if (warnings.length > 0) {
        report += '### Warnings (Should Fix)\n';
        warnings.forEach(issue => {
          report += `- ⚠️ ${issue.message}\n`;
          if (issue.text) report += `  Text: "${issue.text}"\n`;
        });
        report += '\n';
      }
    }

    // Hierarchy
    report += '## Heading Hierarchy\n```\n';
    report += summary.hierarchyTree.join('\n');
    report += '\n```\n';

    return report;
  }
}

// Export singleton instance
export const headingValidator = new HeadingValidator();
