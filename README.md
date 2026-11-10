# Inventory Hub v3

A mobile-first, responsive inventory CRM prototype for GitHub Pages.

## What changed

### Bug fixes
- Fixed mobile date input overflow by explicitly allowing the date field and its parent to shrink.
- Disabled mobile zoom behavior for the application:
  - viewport zoom is disabled
  - Safari gesture zoom events are blocked
  - double-click zoom is blocked

### New CRM-style home
The home page now has two inventory modules:
- **Bar Inventory**
- **Packaging & To-Go**

Each module opens a modal with:
- **View current stock**
- **Start count**

## Bar module

### Current Stock
- Latest inventory snapshot
- Metric cards
- Overview grouped by:
  - Very Low
  - Low
  - In Stock
- Detailed stock view
- Edit assortment mode
- Add / edit / delete liquor items
- Image upload when creating or editing an item

### Bottle count
Each location has:
- `-0.2`
- `-0.1`
- `-1`
- editable numeric field
- `+1`
- `+0.1`
- `+0.2`

Locations:
- Main Bar
- Dragon Room
- Storage

Status logic:
- 0–3 = VERY LOW
- 4–7 = LOW
- 8+ = IN STOCK

## Packaging & To-Go module

Prototype assortment:
- To-Go Box Sushi
- To-Go Box Small
- To-Go Box Medium
- To-Go Box Large
- To-Go Lid Sushi
- To-Go Lid Small
- To-Go Lid Medium
- To-Go Lid Large
- To-Go Small Sauce Cup
- To-Go Small Sauce Cup Lid
- To-Go Drink Cup
- To-Go Drink Cup Lid
- Straws Small
- Straws Big
- To-Go Bag Small
- To-Go Bag Medium
- To-Go Bag Large

Prototype conversion:
- **6 sleeves = 1 case**

Count inputs:
- Full cases
- Loose sleeves
- Automatic equivalent-case calculation

Prototype packaging statuses:
- below 1 equivalent case = CRITICAL
- 1 to under 2 = LOW
- 2 to 4 = IN STOCK
- above 4 = OVERSTOCK

These thresholds are deliberately easy to change later per item.

## Images

Many liquor thumbnails were made from the bar/storage photos supplied in the conversation.

For products that were not clearly visible enough to crop, the prototype uses clean locally generated bottle placeholders. The structure is ready for verified product photography later.

Packaging items use crops from the supplied storage photos.

## Persistence

The prototype is fully client-side and uses `localStorage`.

It stores:
- assortment
- uploaded item photos
- count history by date
- inventory settings

This is suitable for a single-device prototype on GitHub Pages.

For production use across multiple employees/devices, the next architecture step would be a shared backend/database.

## Files

- `index.html`
- `styles.css`
- `app.js`
- `assets/bottles/*`
- `assets/supplies/*`

## GitHub Pages

Upload the contents of this folder to a GitHub repository and enable GitHub Pages.

## v4 image update

The bar catalog now uses the user-supplied product photos for all matching
liquor/wine items received in the three upload batches. Existing locally
generated placeholders remain only for catalog items for which no replacement
photo was supplied.
