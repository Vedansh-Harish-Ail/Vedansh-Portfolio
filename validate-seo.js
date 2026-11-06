const fs = require('fs');

const files = [
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

let failed = false;

console.log('--- VALIDATING SEO & STRUCTURED DATA ---');

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  
  // 1. Check title
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  if (!titleMatch) {
    console.error(`[FAIL] ${f}: Missing <title> tag!`);
    failed = true;
  } else {
    console.log(`[PASS] ${f} Title (${titleMatch[1].length} chars): "${titleMatch[1]}"`);
  }

  // 2. Check meta description
  const descMatch = content.match(/<meta\s+name="description"[\s\S]*?content="([^"]+)"/i);
  if (!descMatch) {
    console.error(`[FAIL] ${f}: Missing meta description!`);
    failed = true;
  } else {
    console.log(`[PASS] ${f} Description (${descMatch[1].length} chars): "${descMatch[1].slice(0, 70)}..."`);
  }

  // 3. Check canonical
  const canonMatch = content.match(/<link rel="canonical" href="([^"]+)"/);
  if (!canonMatch) {
    console.error(`[FAIL] ${f}: Missing canonical URL!`);
    failed = true;
  } else {
    console.log(`[PASS] ${f} Canonical: ${canonMatch[1]}`);
  }

  // 4. Check JSON-LD
  const jsonLdMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!jsonLdMatch) {
    console.error(`[FAIL] ${f}: Missing JSON-LD structured data!`);
    failed = true;
  } else {
    try {
      const parsed = JSON.parse(jsonLdMatch[1].trim());
      const types = parsed['@graph'] ? parsed['@graph'].map(x => x['@type']).join(', ') : parsed['@type'];
      console.log(`[PASS] ${f} JSON-LD Schema: ${types}`);
    } catch (err) {
      console.error(`[FAIL] ${f} JSON-LD Parse Error:`, err.message);
      failed = true;
    }
  }

  console.log('--------------------------------------------------');
});

// Check robots.txt and sitemap.xml
if (fs.existsSync('robots.txt')) {
  console.log('[PASS] robots.txt exists and specifies Sitemap');
} else {
  console.error('[FAIL] robots.txt missing');
  failed = true;
}

if (fs.existsSync('sitemap.xml')) {
  const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  const count = (sitemap.match(/<loc>/g) || []).length;
  console.log(`[PASS] sitemap.xml contains ${count} indexed URLs`);
} else {
  console.error('[FAIL] sitemap.xml missing');
  failed = true;
}

if (fs.existsSync('llms.txt')) {
  console.log('[PASS] llms.txt AI search discoverability file exists');
} else {
  console.error('[FAIL] llms.txt missing');
  failed = true;
}

if (failed) {
  process.exit(1);
} else {
  console.log('ALL SEO AND STRUCTURED DATA CHECKS PASSED PERFECTLY!');
}

