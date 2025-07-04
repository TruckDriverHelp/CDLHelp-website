const fs = require('fs');
const path = require('path');

// Read critical CSS
const criticalCSSPath = path.join(__dirname, '../public/css/critical.css');
const criticalCSS = fs.readFileSync(criticalCSSPath, 'utf8');

// Minify CSS (basic minification)
const minifiedCSS = criticalCSS
  .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
  .replace(/\s+/g, ' ') // Replace multiple spaces with single space
  .replace(/\s*{\s*/g, '{') // Remove spaces around {
  .replace(/\s*}\s*/g, '}') // Remove spaces around }
  .replace(/\s*:\s*/g, ':') // Remove spaces around :
  .replace(/\s*;\s*/g, ';') // Remove spaces around ;
  .replace(/\s*,\s*/g, ',') // Remove spaces around ,
  .replace(/;\}/g, '}') // Remove last semicolon
  .trim();

// Export for use in _document.js
module.exports = minifiedCSS;
