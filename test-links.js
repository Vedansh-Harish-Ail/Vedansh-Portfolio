const fs = require('fs');
const path = require('path');

const pages = [
  'index.html',
  'projects/agrochain/index.html',
  'projects/meri-panchayat/index.html',
  'projects/helio/index.html',
  'projects/printflow/index.html',
  'projects/smart-recipe-generator/index.html',
  'projects/resume-builder/index.html',
  'projects/wedding-invitation/index.html',
  'projects/news-scraper/index.html'
];

let errors = [];

pages.forEach(pagePath => {
  const content = fs.readFileSync(pagePath, 'utf8');
  const pageDir = path.dirname(pagePath);

  // Extract all IDs in this page
  const idMatches = content.matchAll(/id="([^"]+)"/g);
  const ids = new Set();
  for (const m of idMatches) {
    ids.add(m[1]);
  }

  // Check all images
  const srcMatches = content.matchAll(/src="([^"]+)"/g);
  for (const m of srcMatches) {
    const src = m[1];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      continue;
    }
    const resolvedPath = path.normalize(path.join(pageDir, src.split('?')[0].split('#')[0]));
    if (!fs.existsSync(resolvedPath)) {
      errors.push(`[${pagePath}] Broken image src: "${src}" -> resolved to "${resolvedPath}" (NOT FOUND)`);
    }
  }

  // Check all hrefs
  const hrefMatches = content.matchAll(/href="([^"]+)"/g);
  for (const m of hrefMatches) {
    const href = m[1];
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href === '#') {
      continue;
    }
    if (href.startsWith('#')) {
      const anchor = href.slice(1);
      if (!ids.has(anchor)) {
        errors.push(`[${pagePath}] Broken in-page anchor: "${href}" (id="${anchor}" does not exist on page)`);
      }
    } else {
      const [filePath, anchor] = href.split('#');
      const resolvedPath = path.normalize(path.join(pageDir, filePath));
      if (!fs.existsSync(resolvedPath)) {
        errors.push(`[${pagePath}] Broken link href: "${href}" -> resolved to "${resolvedPath}" (NOT FOUND)`);
      } else if (anchor) {
        const targetContent = fs.readFileSync(resolvedPath, 'utf8');
        if (!targetContent.includes(`id="${anchor}"`)) {
          errors.push(`[${pagePath}] Broken anchor target in "${href}": id="${anchor}" not found in ${resolvedPath}`);
        }
      }
    }
  }
});

console.log('--- LINK & ASSET INTEGRITY REPORT ---');
if (errors.length === 0) {
  console.log(`✓ All internal links, anchors, and asset references across ${pages.length} pages are 100% VALID!`);
} else {
  errors.forEach(e => console.error('✗', e));
  process.exit(1);
}

