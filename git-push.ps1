# Clean up any git state
if (Test-Path .git/rebase-merge) { Remove-Item -Recurse -Force .git/rebase-merge }
if (Test-Path .git/REBASE_HEAD) { Remove-Item -Force .git/REBASE_HEAD }
if (Test-Path .git/AUTO_MERGE) { Remove-Item -Force .git/AUTO_MERGE }
if (Test-Path .git/.COMMIT_EDITMSG.swp) { Remove-Item -Force .git/.COMMIT_EDITMSG.swp }

Write-Host "Cleaned up git state" -ForegroundColor Green

# Reset HEAD to branch ref
"ref: refs/heads/main" | Out-File -FilePath .git/HEAD -Encoding ASCII

Write-Host "Checking status..." -ForegroundColor Cyan
git status

Write-Host "`nFetching from origin..." -ForegroundColor Cyan
git fetch origin

Write-Host "`nResetting to our local changes..." -ForegroundColor Cyan
git reset --hard f1ae667

Write-Host "`nPulling from origin with merge..." -ForegroundColor Cyan
git pull origin main --no-edit --strategy-option=ours

Write-Host "`nPushing to origin..." -ForegroundColor Cyan
git push origin main --force-with-lease

Write-Host "`nDone!" -ForegroundColor Green
git log --oneline -5
