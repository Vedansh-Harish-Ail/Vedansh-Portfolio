const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Move toggle to the middle div
const toggleMatch = html.match(/<label class="bb8-toggle">[\s\S]*?<\/label>/);
if (toggleMatch) {
    const toggleHtml = toggleMatch[0];
    
    // Remove the toggle and the flex wrapper around Connect
    html = html.replace(/<div class="flex items-center gap-4">\s*<label class="bb8-toggle">[\s\S]*?<\/label>\s*(<a href="#direct-contact"[\s\S]*?<\/a>)\s*<\/div>/, '$1');
    
    // Insert toggle after Skills
    html = html.replace(/(href="#skills">Skills<\/a>\s*)(<\/div>)/, '$1' + toggleHtml + '\n        $2');
}

// 2. Replace bg-white with bg-surface-container (only in class attributes)
html = html.replace(/class="([^"]*?)bg-white([^"]*?)"/g, 'class="$1bg-surface-container$2"');

// 3. Replace text-white with text-primary-foreground
html = html.replace(/class="([^"]*?)text-white([^"]*?)"/g, 'class="$1text-primary-foreground$2"');

// 4. Fix specific bg-surface-container to bg-surface-variant (lines 1584 & 1599 equivalent)
html = html.replace(/class="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center"/g, 'class="w-12 h-12 rounded-2xl bg-surface-variant flex items-center justify-center"');

fs.writeFileSync('index.html', html);
console.log('Replacements done.');
