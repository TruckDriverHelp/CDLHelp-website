# Claude Configuration for CDL Help Website

## Git Configuration

When making commits in this repository, ensure the following:

### Author Information

All commits must use the following author information:

- **Name**: alur2191
- **Email**: dandavisjs@protonmail.com

### Commit Message Format

Do NOT include any Claude-related signatures or co-authorship. Use clean commit messages without:

- ❌ `🤖 Generated with [Claude Code]`
- ❌ `Co-Authored-By: Claude <noreply@anthropic.com>`
- ❌ Any mention of Claude, AI, or automated generation

### Good Commit Message Example

```
Implement SEO optimizations

- Add structured data for all pages
- Fix meta tag descriptions
- Implement proper hreflang tags
```

### Local Git Configuration

To ensure proper authorship, run these commands in this repository:

```bash
git config user.name "alur2191"
git config user.email "dandavisjs@protonmail.com"
```

## Repository-Specific Notes

This is the Next.js website repository for CDL Help's web presence.

### Key Directories

- `/pages` - Next.js pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and helpers
- `/public` - Static assets
- `/styles` - CSS and styling files

### Important Files

- `next.config.js` - Next.js configuration
- `sitemap.xml` - SEO sitemap
- Various locale files for internationalization

## Development Guidelines

1. Always maintain clean commit history
2. Use descriptive commit messages
3. No AI/Claude attribution in any commits
4. Author must always be alur2191 <dandavisjs@protonmail.com>
