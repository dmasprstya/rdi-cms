/**
 * Performance Report Script
 * Compares baseline with current build and generates report
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

function calculateImprovement(before, after) {
    const diff = before - after;
    const percent = ((diff / before) * 100).toFixed(2);
    const sign = diff > 0 ? '-' : '+';
    return `${sign}${formatBytes(Math.abs(diff))} (${sign}${Math.abs(percent)}%)`;
}

function generateReport() {
    const baselineFile = path.join(process.cwd(), 'scripts', 'performance-baseline.json');

    if (!fs.existsSync(baselineFile)) {
        console.error('❌ Baseline not found. Please run "npm run perf:baseline" first.');
        process.exit(1);
    }

    const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));

    const nextDir = path.join(process.cwd(), '.next');

    if (!fs.existsSync(nextDir)) {
        console.error('❌ .next folder not found. Please run "npm run build" first.');
        process.exit(1);
    }

    const staticDir = path.join(nextDir, 'static');
    const chunksDir = path.join(staticDir, 'chunks');
    const appDir = path.join(chunksDir, 'app');
    const pagesDir = path.join(chunksDir, 'pages');

    const current = {
        timestamp: new Date().toISOString(),
        totalBuildSize: getDirectorySize(nextDir),
        staticSize: getDirectorySize(staticDir),
        chunksSize: getDirectorySize(chunksDir),
        appChunksSize: getDirectorySize(appDir),
        pagesChunksSize: getDirectorySize(pagesDir),
    };

    // Generate markdown report
    let report = `# 🚀 Performance Optimization Report\n\n`;
    report += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    report += `## 📊 Bundle Size Comparison\n\n`;
    report += `| Metric | Before | After | Improvement |\n`;
    report += `|--------|--------|-------|-------------|\n`;
    report += `| Total Build | ${formatBytes(baseline.totalBuildSize)} | ${formatBytes(current.totalBuildSize)} | ${calculateImprovement(baseline.totalBuildSize, current.totalBuildSize)} |\n`;
    report += `| Static Assets | ${formatBytes(baseline.staticSize)} | ${formatBytes(current.staticSize)} | ${calculateImprovement(baseline.staticSize, current.staticSize)} |\n`;
    report += `| Chunks Total | ${formatBytes(baseline.chunksSize)} | ${formatBytes(current.chunksSize)} | ${calculateImprovement(baseline.chunksSize, current.chunksSize)} |\n`;
    report += `| App Chunks | ${formatBytes(baseline.appChunksSize)} | ${formatBytes(current.appChunksSize)} | ${calculateImprovement(baseline.appChunksSize, current.appChunksSize)} |\n`;
    report += `| Pages Chunks | ${formatBytes(baseline.pagesChunksSize)} | ${formatBytes(current.pagesChunksSize)} | ${calculateImprovement(baseline.pagesChunksSize, current.pagesChunksSize)} |\n\n`;

    // Calculate total improvement
    const totalImprovement = baseline.totalBuildSize - current.totalBuildSize;
    const totalPercent = ((totalImprovement / baseline.totalBuildSize) * 100).toFixed(2);

    report += `## 🎯 Summary\n\n`;
    if (totalImprovement > 0) {
        report += `✅ **Total Size Reduction:** ${formatBytes(totalImprovement)} (${totalPercent}%)\n\n`;
    } else {
        report += `⚠️ **Size Increased:** ${formatBytes(Math.abs(totalImprovement))} (+${Math.abs(totalPercent)}%)\n\n`;
    }

    report += `## 📝 Optimization Details\n\n`;
    report += `### Implemented Optimizations:\n\n`;
    report += `- ✅ Bundle Analyzer setup\n`;
    report += `- ✅ Next.js Image optimization (AVIF/WebP)\n`;
    report += `- ✅ Dynamic imports for heavy components (>10KB)\n`;
    report += `- ✅ Optimized Tailwind purge configuration\n`;
    report += `- ✅ Package import optimization (lucide-react, recharts, radix-ui)\n`;
    report += `- ✅ Production console.log removal\n`;
    report += `- ✅ Compressed build output\n\n`;

    report += `## 🔍 Next Steps\n\n`;
    report += `### Recommended Actions:\n\n`;
    report += `1. Run \`npm run build:analyze\` to visualize bundle composition\n`;
    report += `2. Check Lighthouse scores for runtime performance\n`;
    report += `3. Monitor First Contentful Paint (FCP) and Time to Interactive (TTI)\n`;
    report += `4. Consider lazy-loading additional routes if needed\n\n`;

    report += `---\n\n`;
    report += `**Baseline Timestamp:** ${new Date(baseline.timestamp).toLocaleString()}\n`;
    report += `**Current Timestamp:** ${new Date(current.timestamp).toLocaleString()}\n`;

    // Save report
    const reportFile = path.join(process.cwd(), 'PERFORMANCE_REPORT.md');
    fs.writeFileSync(reportFile, report);

    // Print to console
    console.log(report);
    console.log(`\n✅ Full report saved to: ${reportFile}\n`);
}

// Run the report
generateReport();
