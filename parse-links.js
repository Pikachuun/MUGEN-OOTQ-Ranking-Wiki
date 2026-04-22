const fs = require('fs');

const linkContent = fs.readFileSync('Link.txt', 'utf8');
const lines = linkContent.split('\n');
const links = {};

let i = 0;
while (i < lines.length) {
  const name = lines[i].trim();
  i++;
  if (!name || name.startsWith('pass：')) continue;
  
  let url = '';
  while (i < lines.length) {
    const next = lines[i].trim();
    i++;
    if (!next) continue;
    if (next.startsWith('pass：')) break;
    url = next;
    break;
  }
  
  links[name] = url;
}

console.log(JSON.stringify(links, null, 2));
