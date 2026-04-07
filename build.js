const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname);
const dist = path.join(root, 'dist');
const staticFiles = ['azzam-portfolio.html'];
const staticDirs = ['Img', 'sequence'];

function cleanDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  const items = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const item of items) {
    const srcPath = path.join(srcDir, item.name);
    const destPath = path.join(destDir, item.name);
    if (item.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (item.isFile()) {
      copyFile(srcPath, destPath);
    }
  }
}

cleanDir(dist);
fs.mkdirSync(dist, { recursive: true });

staticFiles.forEach(file => {
  copyFile(path.join(root, file), path.join(dist, file));
});

staticDirs.forEach(dir => {
  copyDir(path.join(root, dir), path.join(dist, dir));
});

fs.writeFileSync(path.join(dist, '.nojekyll'), '');
console.log('Built dist folder for deployment.');
