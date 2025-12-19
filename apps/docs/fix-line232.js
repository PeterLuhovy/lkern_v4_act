const fs = require('fs');
const file = './docs/architecture/system-overview.md';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

// Find and fix line 232 (index 231)
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Copies template') && lines[i].includes('{code}')) {
    console.log('Found at line', i + 1, ':', lines[i]);
    // Fix the malformed backticks pattern
    lines[i] = '- Copies template → `services/lkms{code}-{slug}/`';
    console.log('Fixed to:', lines[i]);
  }
}

content = lines.join('\n');
fs.writeFileSync(file, content);
console.log('Done!');
