import fs from 'fs';
import path from 'path';

function fixUserId(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixUserId(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const replaced = content
        .replace(/req\.user\?\.id(?!\s*as\s*any)/g, 'req.user?._id as any')
        .replace(/req\.user\.id(?!\s*as\s*any)/g, 'req.user._id as any')
        // Also fix the assignment query cast in find/findOne calls if any
        .replace(/\{ assignment:\s*[a-zA-Z0-9_.\?]+/g, match => match.endsWith('as any') ? match : `${match} as any`)
        .replace(/\{ course:\s*[a-zA-Z0-9_.\?]+/g, match => match.endsWith('as any') ? match : `${match} as any`);

      if (content !== replaced) {
        fs.writeFileSync(fullPath, replaced, 'utf8');
      }
    }
  }
}

fixUserId(path.join(process.cwd(), 'src/controllers'));
