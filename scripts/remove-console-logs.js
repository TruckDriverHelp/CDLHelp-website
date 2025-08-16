#!/usr/bin/env node

/**
 * Script to remove or comment out console.log statements for production
 * Keeps console.error for error tracking but wraps in production check
 */

const fs = require('fs').promises;
const path = require('path');
const glob = require('glob').glob;

// Paths to exclude from console.log removal
const EXCLUDE_PATHS = [
  '**/node_modules/**',
  '**/build/**',
  '**/.next/**',
  '**/scripts/**', // Keep console logs in scripts
  '**/test/**',
  '**/*.test.js',
  '**/*.spec.js',
  '**/examples/**',
];

// Files to process
const INCLUDE_PATTERNS = [
  'pages/**/*.{js,jsx}',
  'components/**/*.{js,jsx}',
  'lib/**/*.{js,jsx}',
  'src/**/*.{js,jsx}',
];

async function processFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let modified = false;
    const originalContent = content;

    // Remove console.log statements (except in development checks)
    const consoleLogPattern = /^\s*console\.log\([^)]*\);?\s*$/gm;
    if (consoleLogPattern.test(content)) {
      content = content.replace(consoleLogPattern, '');
      modified = true;
    }

    // Wrap console.error in production check if not already wrapped
    const consoleErrorPattern = /^(\s*)console\.error\(([^)]+)\);?$/gm;
    const matches = content.matchAll(consoleErrorPattern);

    for (const match of [...matches]) {
      const indent = match[1];
      const args = match[2];

      // Check if already wrapped in a production check
      const lineNumber = content.substring(0, match.index).split('\n').length;
      const lines = content.split('\n');
      const prevLine = lines[lineNumber - 2] || '';

      if (!prevLine.includes('NODE_ENV') && !prevLine.includes('development')) {
        const replacement = `${indent}if (process.env.NODE_ENV === 'development') {\n${indent}  console.error(${args});\n${indent}}`;
        content = content.replace(match[0], replacement);
        modified = true;
      }
    }

    // Remove console.warn, console.info, console.debug completely
    const otherConsolePattern = /^\s*console\.(warn|info|debug)\([^)]*\);?\s*$/gm;
    if (otherConsolePattern.test(content)) {
      content = content.replace(otherConsolePattern, '');
      modified = true;
    }

    if (modified) {
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`✅ Processed: ${filePath}`);
      return 1;
    }

    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

async function main() {
  console.log('🔍 Removing console logs for production...\n');

  let totalProcessed = 0;

  for (const pattern of INCLUDE_PATTERNS) {
    const files = await glob(pattern, {
      ignore: EXCLUDE_PATHS,
      cwd: process.cwd(),
    });

    for (const file of files) {
      const fullPath = path.join(process.cwd(), file);
      const processed = await processFile(fullPath);
      totalProcessed += processed;
    }
  }

  console.log(`\n✅ Complete! Processed ${totalProcessed} files.`);
  console.log('📝 Note: Console.error statements are now wrapped in development checks.');
  console.log('🔧 Run "npm run lint:fix" to fix any formatting issues.');
}

main().catch(error => {
  console.error('Failed to remove console logs:', error);
  process.exit(1);
});
