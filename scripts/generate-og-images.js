#!/usr/bin/env node

/**
 * Generate default Open Graph images for CDL Help
 * Creates properly sized OG images for social sharing
 */

const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// OG Image dimensions (Facebook, LinkedIn, Twitter)
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Twitter specific dimensions
const TWITTER_WIDTH = 1200;
const TWITTER_HEIGHT = 600;

/**
 * Generate an OG image with CDL Help branding
 */
async function generateOGImage(config) {
  const {
    title,
    subtitle = '',
    outputPath,
    locale = 'en',
    bgGradient = ['#5a5886', '#9290bb'],
    width = OG_WIDTH,
    height = OG_HEIGHT,
  } = config;

  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, bgGradient[0]);
  gradient.addColorStop(1, bgGradient[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add subtle pattern overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let i = 0; i < width; i += 40) {
    ctx.fillRect(i, 0, 1, height);
  }
  for (let i = 0; i < height; i += 40) {
    ctx.fillRect(0, i, width, 1);
  }

  // Logo placeholder (text for now)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('CDL HELP', 80, 80);

  // Main title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px sans-serif';

  // Word wrap for title
  const words = title.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > width - 160 && currentLine) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  });
  lines.push(currentLine.trim());

  // Draw title lines centered
  const lineHeight = 80;
  const totalHeight = lines.length * lineHeight;
  const startY = (height - totalHeight) / 2;

  lines.forEach((line, index) => {
    const metrics = ctx.measureText(line);
    const x = (width - metrics.width) / 2;
    const y = startY + index * lineHeight + 50;

    // Text shadow for better readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillText(line, x, y);
  });

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Subtitle if provided
  if (subtitle) {
    ctx.font = '32px sans-serif';
    ctx.fillStyle = '#fbbf24'; // Yellow accent
    const subtitleMetrics = ctx.measureText(subtitle);
    const subtitleX = (width - subtitleMetrics.width) / 2;
    const subtitleY = startY + totalHeight + 40;
    ctx.fillText(subtitle, subtitleX, subtitleY);
  }

  // Call to action at bottom
  const cta = getCTAByLocale(locale);
  ctx.font = '28px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  const ctaMetrics = ctx.measureText(cta);
  ctx.fillText(cta, (width - ctaMetrics.width) / 2, height - 60);

  // Add corner decoration
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  // Top left
  ctx.beginPath();
  ctx.moveTo(40, 100);
  ctx.lineTo(40, 40);
  ctx.lineTo(100, 40);
  ctx.stroke();
  // Bottom right
  ctx.beginPath();
  ctx.moveTo(width - 40, height - 100);
  ctx.lineTo(width - 40, height - 40);
  ctx.lineTo(width - 100, height - 40);
  ctx.stroke();

  // Save image
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Generated: ${outputPath}`);
}

/**
 * Get localized CTA text
 */
function getCTAByLocale(locale) {
  const ctas = {
    en: 'Free CDL Practice Tests & Study Guides',
    ru: 'Бесплатные тесты CDL и учебные материалы',
    uk: 'Безкоштовні тести CDL та навчальні матеріали',
    ar: 'اختبارات CDL المجانية والأدلة الدراسية',
    ko: '무료 CDL 연습 테스트 및 학습 가이드',
    zh: '免费CDL练习测试和学习指南',
    tr: 'Ücretsiz CDL Uygulama Testleri ve Çalışma Kılavuzları',
    pt: 'Testes práticos CDL gratuitos e guias de estudo',
  };
  return ctas[locale] || ctas['en'];
}

/**
 * Generate all default OG images
 */
async function generateAllOGImages() {
  const outputDir = path.join(__dirname, '../public/images/og');

  console.log('🎨 Generating Open Graph images...\n');

  // Default pages OG images
  const pages = [
    {
      title: 'CDL Practice Test 2025',
      subtitle: 'Pass Your Exam on First Try',
      file: 'og-default.jpg',
    },
    {
      title: 'Download CDL Help App',
      subtitle: 'Available on iOS & Android',
      file: 'og-download.jpg',
      bgGradient: ['#1e3a8a', '#3730a3'],
    },
    {
      title: 'Find CDL Schools Near You',
      subtitle: 'Start Your Trucking Career',
      file: 'og-schools.jpg',
      bgGradient: ['#166534', '#15803d'],
    },
    {
      title: 'CDL Permit Practice Test',
      subtitle: 'All 50 States Covered',
      file: 'og-permit.jpg',
    },
    {
      title: 'Hazmat Endorsement Test',
      subtitle: 'Complete Study Guide',
      file: 'og-hazmat.jpg',
      bgGradient: ['#dc2626', '#991b1b'],
    },
    {
      title: 'Air Brakes Practice Test',
      subtitle: 'Master Air Brake Systems',
      file: 'og-airbrakes.jpg',
      bgGradient: ['#0891b2', '#0e7490'],
    },
    {
      title: 'CDL Test Questions & Answers',
      subtitle: 'Learn From Your Mistakes',
      file: 'og-article.jpg',
    },
    {
      title: 'Join CDL Help Community',
      subtitle: 'Connect With Drivers',
      file: 'og-profile.jpg',
      bgGradient: ['#7c3aed', '#6d28d9'],
    },
  ];

  // Generate Facebook/LinkedIn OG images
  for (const page of pages) {
    await generateOGImage({
      title: page.title,
      subtitle: page.subtitle,
      outputPath: path.join(outputDir, page.file),
      bgGradient: page.bgGradient,
      locale: 'en',
    });
  }

  // Generate Twitter specific image
  await generateOGImage({
    title: 'CDL Practice Test & Study Guide',
    subtitle: 'Free Mobile App',
    outputPath: path.join(outputDir, 'twitter-default.jpg'),
    width: TWITTER_WIDTH,
    height: TWITTER_HEIGHT,
    locale: 'en',
  });

  // Generate localized versions for homepage
  const locales = ['ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
  const localizedTitles = {
    ru: 'Тест CDL 2025',
    uk: 'Тест CDL 2025',
    ar: 'اختبار CDL 2025',
    ko: 'CDL 시험 2025',
    zh: 'CDL考试2025',
    tr: 'CDL Sınavı 2025',
    pt: 'Teste CDL 2025',
  };

  for (const locale of locales) {
    await generateOGImage({
      title: localizedTitles[locale],
      outputPath: path.join(outputDir, `og-default-${locale}.jpg`),
      locale,
    });
  }

  console.log('\n✨ All Open Graph images generated successfully!');
  console.log(`📁 Location: ${outputDir}`);
}

// Run if called directly
if (require.main === module) {
  generateAllOGImages().catch(console.error);
}

module.exports = { generateOGImage, generateAllOGImages };
