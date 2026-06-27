# Bet Tracker

A FanDuel-style personal sports betting tracker. Runs fully in the browser, no real money, no backend — all data lives in `localStorage`.

## Run locally

Double-click `Start Bet Tracker.bat`, or:

```
npm install
npm run dev
```

Then open http://localhost:5173

## Sync across devices

Settings (gear icon) → **Export Backup** downloads a `.json` file with your balance, unit size, and bets. On another device, open Settings → **Import Backup** and pick that file to bring everything over.

## Deploy

See `HOW TO DEPLOY.txt`.
