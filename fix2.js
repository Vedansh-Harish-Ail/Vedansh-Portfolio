const fs = require('fs');
let f = fs.readFileSync('index.html', 'utf8');
f = f.replace(/class=\"([^\"]*?)text-white([^\"]*?)\"/g, 'class="$1text-on-primary$2"');
fs.writeFileSync('index.html', f);
console.log('done text-white replacement');
