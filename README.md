# Toy Haven

Six-page student demonstration website built with HTML, CSS and plain JavaScript.

## Pages and features
Home, Products, Cart, Checkout, Wishlist and Support. Includes search and category filtering, product dialogs, quantity controls, collection statuses, form validation, localStorage persistence and service-worker offline caching.

## Run locally
With Node.js installed, run `node preview.cjs` and open http://localhost:4173. Use a web server rather than opening HTML directly for service-worker testing.

## Publish
In GitHub Settings > Pages, choose Deploy from a branch, main, and /(root). Keep all images and files in their existing folders. Increment the cache version in sw.js when changing cached assets.

## Demonstration limits
No real purchases, payments, emails or account synchronisation occur. Entries remain in the current browser. Do not enter sensitive or real payment information. Product photographs are credited in IMAGE-CREDITS.md; their inclusion does not grant redistribution or commercial rights.

See TESTING.md for verified checks and remaining checks. See VIVA-GUIDE.md for explanations.
