# Simple and reliable batch color replacement
$files = Get-ChildItem -Path "d:\Project\sistem-terintegrasi" -Recurse -Include *.tsx,*.jsx | 
    Where-Object { $_.FullName -notmatch 'node_modules|\.next|\.gemini' }

$changedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $original = $content
    
    # Background replacements
    $content = $content -replace 'bg-white dark:bg-gray-900', 'bg-card'
    $content = $content -replace 'bg-white dark:bg-gray-800', 'bg-background'
    $content = $content -replace 'bg-gray-50 dark:bg-gray-800', 'bg-muted'
    
    # Text replacements
    $content = $content -replace 'text-gray-900 dark:text-white', 'text-foreground'
    $content = $content -replace 'text-gray-600 dark:text-gray-400', 'text-muted-foreground'
    $content = $content -replace 'text-gray-500 dark:text-gray-400', 'text-muted-foreground'
    
    # Border replacements
    $content = $content -replace 'border-gray-200 dark:border-gray-700', 'border-border'
    $content = $content -replace 'border-gray-300 dark:border-gray-600', 'border-border'
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        $changedCount++
        Write-Host "Modified: $($file.Name)"
    }
}

Write-Host ""
Write-Host "Modified $changedCount files"
