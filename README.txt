OWTracker — Global i18n patch

Files:
- src/App.tsx
- src/i18n/I18nDomBridge.tsx

This patch keeps the existing i18n selector/preferences and applies the selected
language across the rest of the current OWTracker UI, including hard-coded text
in Stats, Heroes, Counters, Players, Compare, Perks, Hero Detail, Landing and
common loading/error states.

Install from the OWTracker project root with PowerShell:

Expand-Archive "$env:USERPROFILE\Desktop\OWTracker-i18n-GLOBAL-FINAL.zip" `
  -DestinationPath . `
  -Force

npm run build
npm run dev
