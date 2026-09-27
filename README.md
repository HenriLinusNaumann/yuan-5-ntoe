# yuan-5-note

Präsentation, gehostet auf GitHub Pages. Nach jedem Push auf `main`
baut GitHub Actions die Slides und veröffentlicht sie automatisch.

- **Slideshow:** über die GitHub-Pages-URL eures Repos
- **Lokal ansehen:** `npm install` einmalig, dann `npm run dev`
- **Präsentieren:** im Present Mode `f`, Presenter View `p`

## Präsentation aktualisieren

1. Deck-Ordner `slides/yuan-5-note/` aktualisieren
   (z. B. aus dem Original-Workspace `T2000` kopieren)
2. Committen und pushen:

   ```bash
   git add .
   git commit -m "Update slides"
   git push
   ```

GitHub Actions baut und deployt danach automatisch.

## Hinweise

- Die `base` in `open-slide.config.ts` muss zum Repo-Namen passen
  (`/yuan-5-ntoe/`). Bei einem Repo-Umbenennen anpassen.
- Built von `open-slide build` — statisch, läuft komplett im Browser
  (Laptop, iPad, Handy). Animationen, Steps und Transitions inklusive.
