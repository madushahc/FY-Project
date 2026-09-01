import fs from 'fs';
import path from 'path';

const distSrc = path.join(process.cwd(), 'dist', 'src');
const distFunctions = path.join(process.cwd(), 'dist', 'functions');

if (!fs.existsSync(distFunctions)) {
  fs.mkdirSync(distFunctions, { recursive: true });
}

// Copy serverless.js and app.js into functions directory
const filesToCopy = ['serverless.js', 'app.js'];

filesToCopy.forEach(file => {
  const srcFile = path.join(distSrc, file);
  const destFile = path.join(distFunctions, file);
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied ${file} to dist/functions/`);
  }
});

// Also copy all compiled JS files from dist/src to dist/functions so imports work
fs.readdirSync(distSrc).forEach(file => {
  if (file.endsWith('.js') && !file.endsWith('.d.ts')) {
    fs.copyFileSync(path.join(distSrc, file), path.join(distFunctions, file));
  }
});
