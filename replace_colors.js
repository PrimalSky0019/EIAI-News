const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  content = content.replace(/bg-\[#B31921\]/g, 'bg-primary');
  content = content.replace(/text-\[#B31921\]/g, 'text-primary');
  content = content.replace(/border-\[#B31921\]/g, 'border-primary');
  content = content.replace(/decoration-\[#B31921\]/g, 'decoration-primary');
  content = content.replace(/shadow-\[#B31921\]/g, 'shadow-primary');
  content = content.replace(/selection:bg-\[#B31921\]/g, 'selection:bg-primary');
  // Handle SVG elements in AnalyticsChart and similar components
  content = content.replace(/stopColor="#B31921"/g, 'stopColor="hsl(var(--primary))"');
  content = content.replace(/stroke="#B31921"/g, 'stroke="hsl(var(--primary))"');
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

walkDir('./app', processFile);
walkDir('./components', processFile);
