const fs = require('fs');
const path = require('path');

/**
 * This script fixes two common issues when deploying Expo Web apps to GitHub Pages:
 * 1. GitHub Pages (or the gh-pages tool) can sometimes fail to push deep 'node_modules' folders 
 *    due to Windows path limits or security settings. We flatten fonts into 'assets/f/'.
 * 2. Visual assets are sometimes double-nested in 'assets/assets/'. We flatten them to 'assets/'.
 * 3. We automatically create a '.nojekyll' file to ensure GitHub Pages serves underscore-prefixed folders.
 */

const distDir = 'dist';
const assetsDir = path.join(distDir, 'assets');
const jsDir = path.join(distDir, '_expo/static/js/web');

if (!fs.existsSync(distDir)) {
    console.error('Build directory not found. Please run "expo export" first.');
    process.exit(1);
}

console.log('--- Cleaning and Patching for GitHub Pages ---');

// 1. Create .nojekyll
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('Generated .nojekyll');

// 2. Flatten images from assets/assets/ to assets/
const nestedAssetsDir = path.join(assetsDir, 'assets');
if (fs.existsSync(nestedAssetsDir)) {
    fs.readdirSync(nestedAssetsDir).forEach(file => {
        const src = path.join(nestedAssetsDir, file);
        const dest = path.join(assetsDir, file);
        if (fs.statSync(src).isFile()) {
            fs.renameSync(src, dest);
            console.log(`Flattened image: ${file}`);
        }
    });
}

// 3. Flatten fonts into assets/f/
const fontDest = path.join(assetsDir, 'f');
if (!fs.existsSync(fontDest)) fs.mkdirSync(fontDest, { recursive: true });

function findFonts(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findFonts(fullPath);
        } else if (file.endsWith('.ttf') || file.endsWith('.otf') || file.endsWith('.woff')) {
            fs.copyFileSync(fullPath, path.join(fontDest, file));
            console.log(`Extracted font: ${file}`);
        }
    }
}

const nodeIconsDir = path.join(assetsDir, 'node_modules');
if (fs.existsSync(nodeIconsDir)) {
    findFonts(nodeIconsDir);
    // Remove the node_modules folder to avoid long path issues on Windows
    fs.rmSync(nodeIconsDir, { recursive: true, force: true });
    console.log('Cleaned up source font folders');
}

// 4. Patch JS Bundle
if (fs.existsSync(jsDir)) {
    fs.readdirSync(jsDir).forEach(file => {
        if (file.endsWith('.js')) {
            const filePath = path.join(jsDir, file);
            let content = fs.readFileSync(filePath, 'utf8');

            // Redirection for fonts
            const oldFontPrefix = 'assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/';
            const fontMatches = content.split(oldFontPrefix).length - 1;
            content = content.split(oldFontPrefix).join('assets/f/');

            // Redirection for images
            const assetMatches = content.split('assets/assets/').length - 1;
            content = content.split('assets/assets/').join('assets/');

            fs.writeFileSync(filePath, content);
            console.log(`Patched bundle ${file}: ${fontMatches} fonts, ${assetMatches} images updated.`);
        }
    });
}

console.log('--- Deployment adjustments complete ---');
