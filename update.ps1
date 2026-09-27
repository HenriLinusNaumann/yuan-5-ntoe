# update.ps1 — aktualisiert die Online-Praesentation
# Kopiert das Deck aus T2000 und veroeffentlicht es auf GitHub Pages.
# Ausfuehren im Repo-Ordner:  .\update.ps1

$src  = "C:\Users\henri\Documents\GitHub\T2000\slides\yuan-5-note"
$deck = "slides\yuan-5-note"

if (-not (Test-Path $src)) {
    Write-Host "Fehler: Quelle nicht gefunden: $src" -ForegroundColor Red
    exit 1
}

# Deck ersetzen (erst loeschen, damit geloeschte Dateien nicht uebrig bleiben)
Remove-Item -Recurse -Force $deck
Copy-Item -Recurse $src $deck

# Nichts geaendert? Dann stoppen.
if (-not (git status --porcelain)) {
    Write-Host "Keine Aenderungen gefunden — nichts zu tun." -ForegroundColor Yellow
    exit 0
}

# Committen & pushen
git add .
git commit -m "Slides aktualisiert ($(Get-Date -Format 'yyyy-MM-dd HH:mm'))"
git push

Write-Host ""
Write-Host "Fertig! In ca. 1 Minute ist die neue Version online:" -ForegroundColor Green
Write-Host "https://henrilinusnaumann.github.io/yuan-5-ntoe/" -ForegroundColor Green
