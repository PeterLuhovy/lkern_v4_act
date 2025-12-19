const fs = require('fs');

const files = [
  './docs/architecture/system-overview.md',
  './docs/architecture/port-mapping.md',
  './docs/guides/docker-standards.md',
  './docs/project/roadmap.md',
  './docs/api/config.md'
];

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');

    // Replace problematic patterns with backtick-wrapped versions
    // Pattern: {XXX} or {code} or {slug} etc that are NOT already in backticks or code blocks

    // Simple approach: wrap these specific patterns in backticks
    content = content.replace(/services\/lkms\{code\}-\{slug\}\//g, '`services/lkms{code}-{slug}/`');
    content = content.replace(/lkms\{code\}-\{slug\}/g, '`lkms{code}-{slug}`');
    content = content.replace(/\(LKMS\{XXX\}/g, '(`LKMS{XXX}`');
    content = content.replace(/Port 4\{XXX\}\)/g, 'Port `4{XXX}`)');
    content = content.replace(/port 4\{XXX\}/g, 'port `4{XXX}`');
    content = content.replace(/5\{XXX\}/g, '`5{XXX}`');
    content = content.replace(/\(lkms\{id\}-\{name\}\)/g, '(`lkms{id}-{name}`)');
    content = content.replace(/→ 4\{XXX\}/g, '→ `4{XXX}`');

    fs.writeFileSync(file, content);
    console.log('Fixed:', file);
  } catch(e) {
    console.log('Error:', file, e.message);
  }
});

console.log('Done!');
