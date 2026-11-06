# 👟 Triple Jump 43-Foot Tracker

An interactive training site for a triple jump plan: Week 0 (starts Fri Nov 20) plus 22 more weeks.

- **Winter (Week 0 starts Fri Nov 20; Weeks 1–12: Nov 23 – Feb 14):** weight room focus, 4 days a week (Tue–Fri). No practice on Mondays.
- **Spring (Feb 16 – Apr 25):** technique, drills and approach work
- Check off every exercise, log weights and notes, track your jumps toward 43 ft
- Change your goal distance any time on the Progress tab (the bar, chart and hop/step/jump targets follow it)
- Mark meet days: skip that day's workout, get a light-day reminder before it, add meet dates any time
- No installs, no build step, no dependencies: just HTML, CSS and JavaScript

## Files

| File         | What it does                                              |
| ------------ | --------------------------------------------------------- |
| `index.html` | The page                                                  |
| `styles.css` | Look and feel (light and dark mode, phone friendly)       |
| `plan.js`    | **The whole workout plan.** Edit this to change exercises |
| `app.js`     | Checkboxes, logs, jump chart, backup/restore              |

## Run it in VS Code

1. Install [VS Code](https://code.visualstudio.com/).
2. Open the `triple-jump-tracker` folder (File → Open Folder).
3. Easiest preview: install the **Live Server** extension, right-click `index.html`, choose **Open with Live Server**.
   You can also just double-click `index.html` to open it in your browser.

## Put it on GitHub (and get a real website link)

1. Make a free account at [github.com](https://github.com).
2. Create a new repository (for example `triple-jump-tracker`). Keep it Public so GitHub Pages works on a free account.
3. In VS Code, open the terminal (Terminal → New Terminal) and run:

   ```bash
   git init
   git add .
   git commit -m "Triple jump tracker"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/triple-jump-tracker.git
   git push -u origin main
   ```

4. On GitHub, open the repo → **Settings → Pages**.
5. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main**, folder **/ (root)**, then Save.
6. After a minute your site is live at `https://YOUR-USERNAME.github.io/triple-jump-tracker/`.
   Open that link on your phone and use "Add to Home Screen" to keep it handy in your track bag.

To update it later: edit files in VS Code, then run `git add .`, `git commit -m "update"`, `git push`.

## Changing the plan

Open `plan.js`. Each exercise looks like this:

```js
ex("Back Squat", "4 × 5")
```

Change the name, sets or reps and save. Dates come from the `WEEKS` section at the bottom
(Week 0 is a short Fri–Sun week starting `2026-11-20`, Week 1 starts `2026-11-23`). To move your championship taper,
change which weeks use the `p6` phase.

## Your progress is saved per browser

Check-offs, notes and jumps are stored in your browser's `localStorage`. That means your phone and
laptop do **not** share progress automatically. Use **Progress → Export backup** on one device and
**Import backup** on the other. Clearing your browser data erases progress, so export a backup now and then.

## Safety

Sharp pain in a shin, knee, back or shoulder means stop and tell your coach. Use a spotter on heavy
lifts. Only do cleans if a coach has taught you the technique.
