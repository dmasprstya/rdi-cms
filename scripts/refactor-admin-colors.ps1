# PowerShell script untuk batch color replacement
$ErrorActionPreference = "Stop"

$files = @(
    "d:\Project\sistem-terintegrasi\components\admin\grades-management.tsx",
    "d:\Project\sistem-terintegrasi\components\admin\students-management.tsx",
    "d:\Project\sistem-terintegrasi\components\admin\teachers-management.tsx"
)

foreach ($file in $files) {
    Write-Host "Processing: $file"
    
    $content = Get-Content $file -Raw -Encoding UTF8
    
    # Pattern replacements
    $content = $content -replace 'text-gray-900 dark:text-white', 'text-foreground'
    $content = $content -replace 'text-gray-600 dark:text-gray-400', 'text-muted-foreground'
    $content = $content -replace 'text-gray-500 dark:text-gray-400', 'text-muted-foreground'
    $content = $content -replace 'bg-yellow-400 hover:bg-yellow-500 text-black', 'bg-primary hover:bg-primary/90 text-primary-foreground'
    $content = $content -replace 'text-yellow-400', 'text-primary'
    $content = $content -replace 'bg-white dark:bg-gray-900', 'bg-card'
    $content = $content -replace 'text-gray-700 dark:text-gray-300', 'text-foreground'
    $content = $content -replace 'text-red-500', 'text-destructive'
    $content = $content -replace 'border-gray-200 dark:border-gray-700', 'border-border'
    $content = $content -replace 'divide-gray-200 dark:divide-gray-700', 'divide-border'
    $content = $content -replace 'hover:bg-gray-50 dark:hover:bg-gray-800', 'hover:bg-muted/50'
    $content = $content -replace 'border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400', 'border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
    $content = $content -replace 'bg-red-600 hover:bg-red-700 text-white', 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
    $content = $content -replace 'text-gray-400', 'text-muted-foreground'
    
    Set-Content -Path $file -Value $content -NoNewline -Encoding UTF8
    
    Write-Host "Completed: $file"
}

Write-Host "All management components refactored successfully!" -ForegroundColor Green
