const fs = require('fs');
const path = require('path');

// Copy directory recursively
function copyDirectory(src, dest) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // Read all files/folders in source directory
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Recursively copy subdirectory
            copyDirectory(srcPath, destPath);
        } else {
            // Copy file
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied: ${entry.name}`);
        }
    }
}

console.log('========================================');
console.log('Copying scripts/public to out/');
console.log('========================================');

const sourceDir = path.join(__dirname, 'public');
const destDir = path.join(__dirname, '../out');

try {
    // Check if source directory exists
    if (!fs.existsSync(sourceDir)) {
        console.log(`Source directory not found: ${sourceDir}`);
        console.log('Skipping copy.');
        process.exit(0);
    }

    // Copy all files from scripts/public to out
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(sourceDir, entry.name);
        const destPath = path.join(destDir, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied: ${entry.name}`);
        }
    }

    console.log('========================================');
    console.log('✓ All files copied successfully!');
    console.log('========================================');
} catch (error) {
    console.error('Error copying files:', error);
    process.exit(1);
}
