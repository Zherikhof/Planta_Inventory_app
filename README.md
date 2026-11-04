
# Bar Stock Prototype v2

This version is intentionally written as normal, readable source code rather than compressed prototype code.

## Main improvements

- Clean indentation and formatting across HTML, CSS, and JavaScript
- Clear class naming and section comments
- Better accessibility labels
- Mobile-first layout
- Responsive support for:
  - small phones
  - normal phones
  - tablets
  - laptops
  - desktops
- 1-column inventory cards on tablet/mobile
- 2-column cards on regular desktop
- 3-column cards on wide desktop
- responsive dialogs and controls
- safe-area support for iPhones
- larger touch targets for mobile use

## Current inventory logic

- New date starts blank
- Optional copy from previous date
- Locations:
  - Main Bar
  - Dragon Room
  - Storage
- Count via plus/minus buttons or manual input
- Decimal values supported
- Statuses:
  - 0–3 = VERY LOW
  - 4–7 = LOW
  - 8+ = IN STOCK
- Summary sorted:
  - VERY LOW
  - LOW
  - IN STOCK
  - NOT COUNTED
- Data stored locally in the browser using `localStorage`

## GitHub Pages

Upload these files to a GitHub repository:

- `index.html`
- `styles.css`
- `app.js`

Then enable GitHub Pages in the repository settings.

## Next planned improvements

- verified bottle images
- complete bottle list
- per-bottle par settings
- analytics page
- improved history/comparison tools
