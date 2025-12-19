const fs = require('fs');

const files = [
  './docs/architecture/port-mapping.md',
  './docs/guides/docker-standards.md',
  './docs/project/roadmap.md',
  './docs/api/config.md'
];

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix all patterns that cause MDX crashes
    // Pattern: {LKMS} -> `{LKMS}`
    content = content.replace(/= 4\{LKMS\}/g, '= `4{LKMS}`');

    // Pattern: {XXX} outside code blocks
    content = content.replace(/\(LKMS-XXX → Port 4XXX\)/g, '(`LKMS-XXX` → Port `4XXX`)');
    content = content.replace(/\(LKMS-XXX → 4XXX\)/g, '(`LKMS-XXX` → `4XXX`)');

    // Pattern: {id}-{name}
    content = content.replace(/\(lkms\{id\}-\{name\}\)/g, '(`lkms{id}-{name}`)');

    // Pattern: {code}-{slug}
    content = content.replace(/lkms\{code\}-\{slug\}(?!`)/g, '`lkms{code}-{slug}`');

    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log('Fixed:', file);
    } else {
      console.log('No changes:', file);
    }
  } catch(e) {
    console.log('Error:', file, e.message);
  }
});

console.log('Done!');
