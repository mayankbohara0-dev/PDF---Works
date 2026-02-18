const fs = require('fs');
const path = require('path');

console.log('🔍 Checking development environment...');

// 1. Check if node_modules exist in root, client, and server
const requiredDirs = [
    { path: 'node_modules', name: 'Root dependencies' },
    { path: 'client/node_modules', name: 'Client dependencies' },
    { path: 'server/node_modules', name: 'Server dependencies' }
];

let missingDeps = false;

requiredDirs.forEach(dir => {
    if (!fs.existsSync(path.join(__dirname, dir.path))) {
        console.error(`❌ Missing ${dir.name}. Please run 'npm install' in ${dir.path.split('/')[0] || 'root'}.`);
        missingDeps = true;
    } else {
        console.log(`✅ ${dir.name} found.`);
    }
});

// 2. Check .env files
const requiredFiles = [
    { path: 'server/.env', name: 'Server .env' },
    { path: 'client/.env', name: 'Client .env (optional)' }
];

requiredFiles.forEach(file => {
    if (!fs.existsSync(path.join(__dirname, file.path))) {
        console.warn(`⚠️ Warning: ${file.name} not found. Using defaults/examples.`);
        // Try to copy from example if it exists and target doesn't
        const examplePath = path.join(__dirname, file.path + '.example');
        if (fs.existsSync(examplePath)) {
            console.log(`💡 Copying ${file.path}.example to ${file.path}...`);
            fs.copyFileSync(examplePath, path.join(__dirname, file.path));
            console.log(`✅ Created ${file.path} from example.`);
        }
    } else {
        console.log(`✅ ${file.name} found.`);
    }
});

if (missingDeps) {
    console.error('\n💥 Critical dependencies missing. Setup required.');
    process.exit(1);
}

console.log('\n🚀 Environment check passed. Starting servers...\n');
