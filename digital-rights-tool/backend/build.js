const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Compile TypeScript files to JavaScript
console.log('Compiling TypeScript files...');
try {
  execSync('npx tsc', { stdio: 'inherit' });
  console.log('TypeScript compilation completed successfully!');
} catch (error) {
  console.error('TypeScript compilation failed:', error);
  process.exit(1);
}

// Run Prisma generate
console.log('Running Prisma generate...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma generate completed successfully!');
} catch (error) {
  console.error('Prisma generate failed:', error);
  process.exit(1);
}

console.log('Build completed successfully!'); 