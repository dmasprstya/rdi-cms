/**
 * Performance Baseline Script
 * Captures bundle sizes and performance metrics before optimization
 */

const fs = require('fs');
const path = require('path');

function getDirectorySize(dirPath) {
    let totalSize = 0;

    if (!fs.existsSync(dirPath)) {
        return 0;
    }

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            totalSize += getDirectorySize(filePath);
        } else {
            totalSize += stats.size;
        }
    }

    return totalSize;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
    const nextDir = path.join(process.cwd(), '.next');

    if (!fs.existsSync(nextDir)) {
        console.error('❌ .next folder not found. Please run "npm run build" first.');
        process.exit(1);
    }

    const staticDir = path.join(nextDir, 'static');
    const chunksDir = path.join(staticDir, 'chunks');
    const appDir = path.join(chunksDir, 'app');
    const pagesDir = path.join(chunksDir, 'pages');

    const metrics = {
        timestamp: new Date().toISOString(),
        totalBuildSize: getDirectorySize(nextDir),
        staticSize: getDirectorySize(staticDir),
        chunksSize: getDirectorySize(chunksDir),
        appChunksSize: getDirectorySize(appDir),
        pagesChunksSize: getDirectorySize(pagesDir),
    };

    // Get individual chunk sizes
    const chunks = [];
    if (fs.existsSync(chunksDir)) {
        const files = fs.readdirSync(chunksDir);
        files.forEach(file => {
            const filePath = path.join(chunksDir, file);
            if (fs.statSync(filePath).isFile() && file.endsWith('.js')) {
                chunks.push({
                    name: file,
                    size: fs.statSync(filePath).size
                });
            }
        });
    }

    // Sort chunks by size
    chunks.sort((a, b) => b.size - a.size);
    metrics.topChunks = chunks.slice(0, 10);

    // Save baseline
    const baselineFile = path.join(process.cwd(), 'scripts', 'performance-baseline.json');
    fs.writeFileSync(baselineFile, JSON.stringify(metrics, null, 2));

    // Print report
    console.log('\n📊 BASELINE PERFORMANCE METRICS\n');
    console.log('================================\n');
    console.log(`Total Build Size:     ${formatBytes(metrics.totalBuildSize)}`);
    console.log(`Static Assets:        ${formatBytes(metrics.staticSize)}`);
    console.log(`Chunks Total:         ${formatBytes(metrics.chunksSize)}`);
    console.log(`App Chunks:           ${formatBytes(metrics.appChunksSize)}`);
    console.log(`Pages Chunks:         ${formatBytes(metrics.pagesChunksSize)}\n`);

    console.log('Top 10 Largest Chunks:\n');
    metrics.topChunks.forEach((chunk, index) => {
        console.log(`${index + 1}. ${chunk.name.padEnd(50)} ${formatBytes(chunk.size)}`);
    });

    console.log(`\n✅ Baseline saved to: ${baselineFile}\n`);
}

// Run the analysis
analyzeBundle();
