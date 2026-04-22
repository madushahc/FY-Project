import fs from 'fs';
import path from 'path';

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // regex to match: import ... from '../something' or './something'
      // basically any string starting with '.' and ending without '.js'
      const replaced = content.replace(/from\s+['"]([^'"]+)['"]/g, (match, p1) => {
        if (p1.startsWith('.') && !p1.endsWith('.js')) {
          return `from '${p1}.js'`;
        }
        return match;
      });
      
      if (content !== replaced) {
        fs.writeFileSync(fullPath, replaced, 'utf8');
      }
    }
  }
}

fixImports(path.join(process.cwd(), 'src'));
