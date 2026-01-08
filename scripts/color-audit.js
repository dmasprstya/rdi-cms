const fs = require('fs');
const path = require('path');

const results = {
    routes: [],
    components: [],
    colorUsage: {},
    semanticElements: {
        statsCards: new Set(),
        statusBadges: new Set(),
        buttons: new Set(),
    },
    summary: {
        totalFiles: 0,
        uniqueColors: 0,
        tailwindClasses: {},
        cssVariables: {},
        hexColors: {},
    }
};

// Patterns to match
const patterns = {
    // Tailwind color classes
    bg: /bg-(\w+-\d+|[\w-]+)/g,
    text: /text-(\w+-\d+|[\w-]+)/g,
    border: /border-(\w+-\d+|[\w-]+)/g,
    ring: /ring-(\w+-\d+|[\w-]+)/g,
    from: /from-(\w+-\d+|[\w-]+)/g,
    to: /to-(\w+-\d+|[\w-]+)/g,
    via: /via-(\w+-\d+|[\w-]+)/g,

    // CSS custom properties
    cssVar: /var\(--([\w-]+)\)/g,

    // Hex colors
    hex: /#([0-9a-fA-F]{3,6})/g,

    // RGB/HSL
    rgb: /rgba?\([^)]+\)/g,
    hsl: /hsla?\([^)]+\)/g,
};

// Routes mapping
const routeMap = [
    { path: '/', files: ['app/page.tsx', 'components/landing/**'], role: 'public' },
    { path: '/login', files: ['app/login/page.tsx'], role: 'public' },
    { path: '/dashboard', files: ['app/dashboard/**'], role: 'admin' },
    { path: '/student', files: ['app/student/**'], role: 'student' },
    { path: '/editor', files: ['app/editor/**'], role: 'editor' },
];

function scanDirectory(dir, filePattern = /\.(tsx|jsx|css|ts)$/) {
    const files = [];

    function walk(directory) {
        const items = fs.readdirSync(directory);

        for (const item of items) {
            const fullPath = path.join(directory, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // Skip node_modules, .next, etc
                if (!['node_modules', '.next', 'dist', 'build'].includes(item)) {
                    walk(fullPath);
                }
            } else if (filePattern.test(item)) {
                files.push(fullPath);
            }
        }
    }

    walk(dir);
    return files;
}

function extractColors(content, filePath) {
    const fileColors = {
        tailwind: {},
        cssVars: new Set(),
        hex: new Set(),
        rgb: new Set(),
        hsl: new Set(),
    };

    // Extract Tailwind color classes
    ['bg', 'text', 'border', 'ring', 'from', 'to', 'via'].forEach(prefix => {
        const matches = content.matchAll(patterns[prefix]);
        for (const match of matches) {
            const colorClass = `${prefix}-${match[1]}`;
            const fullMatch = match[0];

            if (!fileColors.tailwind[fullMatch]) {
                fileColors.tailwind[fullMatch] = [];
            }

            // Find line number
            const lines = content.substring(0, match.index).split('\n');
            const lineNumber = lines.length;

            fileColors.tailwind[fullMatch].push(lineNumber);

            // Add to global usage
            if (!results.colorUsage[fullMatch]) {
                results.colorUsage[fullMatch] = { count: 0, locations: [] };
            }
            results.colorUsage[fullMatch].count++;
            results.colorUsage[fullMatch].locations.push(`${filePath}:${lineNumber}`);
        }
    });

    // Extract CSS variables
    const cssVarMatches = content.matchAll(patterns.cssVar);
    for (const match of cssVarMatches) {
        const varName = `var(--${match[1]})`;
        fileColors.cssVars.add(varName);

        if (!results.colorUsage[varName]) {
            results.colorUsage[varName] = { count: 0, locations: [] };
        }
        results.colorUsage[varName].count++;

        const lines = content.substring(0, match.index).split('\n');
        results.colorUsage[varName].locations.push(`${filePath}:${lines.length}`);
    }

    // Extract hex colors
    const hexMatches = content.matchAll(patterns.hex);
    for (const match of hexMatches) {
        const hexColor = match[0];
        fileColors.hex.add(hexColor);

        if (!results.colorUsage[hexColor]) {
            results.colorUsage[hexColor] = { count: 0, locations: [] };
        }
        results.colorUsage[hexColor].count++;

        const lines = content.substring(0, match.index).split('\n');
        results.colorUsage[hexColor].locations.push(`${filePath}:${lines.length}`);
    }

    return fileColors;
}

function extractSemanticElements(content, filePath) {
    // Extract stat cards
    const statCardPattern = /(Total|Jumlah)\s+(Siswa|Guru|Kelas|Mata Pelajaran)/gi;
    const statMatches = content.matchAll(statCardPattern);
    for (const match of statMatches) {
        results.semanticElements.statsCards.add(match[0]);
    }

    // Extract status badges
    const statusPattern = /(Aktif|Tidak Aktif|Hadir|Izin|Sakit|Alpha|Published|Draft)/gi;
    const statusMatches = content.matchAll(statusPattern);
    for (const match of statusMatches) {
        results.semanticElements.statusBadges.add(match[0]);
    }

    // Extract button variants
    const buttonPattern = /className=["`']([^"`']*?)(primary|secondary|danger|success|warning|destructive)([^"`']*?)["`']/gi;
    const buttonMatches = content.matchAll(buttonPattern);
    for (const match of buttonMatches) {
        results.semanticElements.buttons.add(match[2]);
    }
}

function analyzeComponents(files) {
    const componentFiles = files.filter(f =>
        f.includes('components') && (f.endsWith('.tsx') || f.endsWith('.jsx'))
    );

    for (const file of componentFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        const relativePath = path.relative(process.cwd(), file);
        const componentName = path.basename(file, path.extname(file));

        const colors = extractColors(content, relativePath);
        extractSemanticElements(content, relativePath);

        // Detect variants from content
        const variants = [];
        if (content.includes('variant')) {
            const variantMatch = content.match(/variant\s*[=:]\s*["'](\w+)["']/g);
            if (variantMatch) {
                variants.push(...variantMatch.map(m => m.match(/["'](\w+)["']/)[1]));
            }
        }

        const allColors = [
            ...Object.keys(colors.tailwind),
            ...colors.cssVars,
            ...colors.hex,
        ];

        if (allColors.length > 0) {
            results.components.push({
                name: componentName,
                file: relativePath,
                variants: [...new Set(variants)],
                colors: [...new Set(allColors)],
                colorCount: allColors.length,
            });
        }
    }
}

function analyzeRoutes(files) {
    for (const route of routeMap) {
        const routeFiles = [];

        for (const filePattern of route.files) {
            const pattern = filePattern.replace('**', '');
            const matchedFiles = files.filter(f => f.includes(pattern.replace(/\*/g, '')));
            routeFiles.push(...matchedFiles.map(f => path.relative(process.cwd(), f)));
        }

        results.routes.push({
            path: route.path,
            role: route.role,
            files: [...new Set(routeFiles)],
            fileCount: routeFiles.length,
        });
    }
}

// Main execution
console.log('🔍 Starting color system audit...\n');

const projectRoot = process.cwd();
const files = scanDirectory(projectRoot);

console.log(`📁 Found ${files.length} files to analyze\n`);

results.summary.totalFiles = files.length;

// Analyze each file
files.forEach((file, index) => {
    if ((index + 1) % 10 === 0) {
        console.log(`   Processing: ${index + 1}/${files.length} files...`);
    }

    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(projectRoot, file);

    extractColors(content, relativePath);
    extractSemanticElements(content, relativePath);
});

console.log(`✅ Analyzed all files\n`);

// Analyze components and routes
console.log('🔧 Analyzing components...');
analyzeComponents(files);

console.log('🛣️  Analyzing routes...');
analyzeRoutes(files);

// Calculate summary
results.summary.uniqueColors = Object.keys(results.colorUsage).length;

// Sort colors by usage
const sortedColors = Object.entries(results.colorUsage)
    .sort((a, b) => b[1].count - a[1].count)
    .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});

results.colorUsage = sortedColors;

// Convert sets to arrays
results.semanticElements.statsCards = [...results.semanticElements.statsCards];
results.semanticElements.statusBadges = [...results.semanticElements.statusBadges];
results.semanticElements.buttons = [...results.semanticElements.buttons];

// Sort components by color count
results.components.sort((a, b) => b.colorCount - a.colorCount);

// Generate output
const outputDir = path.join(projectRoot, 'docs');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Write JSON report
const jsonPath = path.join(outputDir, 'color-audit.json');
fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
console.log(`\n📄 JSON report saved: ${jsonPath}`);

// Write Markdown report
const mdPath = path.join(outputDir, 'color-audit.md');
let markdown = `# Color System Audit Report

Generated: ${new Date().toISOString()}

## Summary

- **Total Files Analyzed**: ${results.summary.totalFiles}
- **Unique Colors Found**: ${results.summary.uniqueColors}
- **Total Components**: ${results.components.length}
- **Total Routes**: ${results.routes.length}

## Routes

${results.routes.map(route => `
### ${route.path} (${route.role})
- **Files**: ${route.fileCount}
${route.files.slice(0, 5).map(f => `  - ${f}`).join('\n')}
${route.files.length > 5 ? `  - ... and ${route.files.length - 5} more` : ''}
`).join('\n')}

## Top Components by Color Usage

${results.components.slice(0, 20).map(comp => `
### ${comp.name}
- **File**: \`${comp.file}\`
- **Color Count**: ${comp.colorCount}
- **Variants**: ${comp.variants.length > 0 ? comp.variants.join(', ') : 'None detected'}
- **Colors**: ${comp.colors.slice(0, 10).join(', ')}${comp.colors.length > 10 ? ` ... and ${comp.colors.length - 10} more` : ''}
`).join('\n')}

## Color Usage Statistics

### Most Used Colors (Top 30)

${Object.entries(results.colorUsage).slice(0, 30).map(([color, data], index) => `
${index + 1}. **\`${color}\`**
   - Usage count: **${data.count}**
   - Sample locations:
${data.locations.slice(0, 3).map(loc => `     - ${loc}`).join('\n')}
${data.locations.length > 3 ? `     - ... and ${data.locations.length - 3} more` : ''}
`).join('\n')}

## Semantic Elements

### Stats Cards
${results.semanticElements.statsCards.map(s => `- ${s}`).join('\n')}

### Status Badges
${results.semanticElements.statusBadges.map(s => `- ${s}`).join('\n')}

### Button Variants
${results.semanticElements.buttons.map(s => `- ${s}`).join('\n')}

## Recommendations

### Color Palette Analysis

**Current State**: Using ${results.summary.uniqueColors} unique color tokens

**Issues Identified**:
${Object.keys(results.colorUsage).filter(c => c.includes('gray-') || c.includes('slate-')).length > 0 ?
        `- Multiple gray/slate variants detected (${Object.keys(results.colorUsage).filter(c => c.includes('gray-') || c.includes('slate-')).length} total)` : ''}
${Object.keys(results.colorUsage).filter(c => c.startsWith('bg-yellow') || c.startsWith('text-yellow')).length > 0 ?
        `- Yellow color usage: ${Object.keys(results.colorUsage).filter(c => c.startsWith('bg-yellow') || c.startsWith('text-yellow')).length} variations` : ''}
${Object.keys(results.colorUsage).filter(c => c.startsWith('#')).length > 0 ?
        `- Hardcoded hex colors found: ${Object.keys(results.colorUsage).filter(c => c.startsWith('#')).length} instances` : ''}

### Suggested Minimal Color Palette

Based on the analysis, we recommend consolidating to these semantic tokens:

**Base Colors** (from tailwind.config.ts):
- \`background\` / \`foreground\`
- \`card\` / \`card-foreground\`
- \`primary\` / \`primary-foreground\` (Yellow brand color)
- \`secondary\` / \`secondary-foreground\`
- \`muted\` / \`muted-foreground\`
- \`accent\` / \`accent-foreground\`
- \`border\` / \`input\` / \`ring\`

**Status Colors**:
- \`destructive\` (Red for errors/danger)
- \`success\` (Green for success states)
- \`warning\` (Orange for warnings)
- \`info\` (Blue for informational)

**Replace Hardcoded Colors**:
${Object.entries(results.colorUsage)
        .filter(([color]) => color.startsWith('bg-yellow') || color.startsWith('text-yellow'))
        .slice(0, 5)
        .map(([color, data]) => `- \`${color}\` (${data.count} uses) → Use \`bg-primary\` or \`text-primary\``)
        .join('\n')}

### Inconsistencies Found

${results.components
        .filter(c => c.colors.some(color =>
            color.includes('gray-') || color.includes('slate-') || color.startsWith('#')
        ))
        .slice(0, 10)
        .map(c => `- **${c.name}**: Uses hardcoded or inconsistent colors`)
        .join('\n')}

## Next Steps

1. **Consolidate gray variants**: Replace all gray-*/slate-* with semantic tokens
2. **Replace yellow variants**: Use \`primary\` semantic token instead of \`yellow-400\`, \`yellow-500\`, etc.
3. **Remove hex colors**: Convert all hex colors to semantic tokens
4. **Standardize status badges**: Use consistent color tokens for status indicators
5. **Update dark mode**: Ensure all colors work well in both light and dark modes
`;

fs.writeFileSync(mdPath, markdown);
console.log(`📄 Markdown report saved: ${mdPath}`);

console.log('\n✨ Color audit complete!\n');
console.log(`📊 Summary:`);
console.log(`   - Unique colors: ${results.summary.uniqueColors}`);
console.log(`   - Components analyzed: ${results.components.length}`);
console.log(`   - Routes mapped: ${results.routes.length}`);
console.log(`\n📖 Check the reports in the docs/ folder for detailed analysis.\n`);
