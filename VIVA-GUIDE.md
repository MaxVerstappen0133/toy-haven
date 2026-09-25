# Toy Haven viva guide

## How to run it

Open a terminal in this folder and run `node preview.cjs`, then visit http://localhost:4173. Node only serves the files for local preview; the website itself uses HTML, CSS and JavaScript. You can also use your editor's local web server. Service workers need localhost or HTTPS, so use a server when demonstrating offline support.

## Explain the website in one minute

Toy Haven is a six-page front-end demo shop. HTML provides the page structure, CSS controls the layout and appearance, and JavaScript handles interaction. Product information comes from an array in data.js. The cart, wishlist, orders, feedback and newsletter subscriptions are saved in localStorage. There is no backend or real payment processing.

## What each file does

| File | Purpose |
| --- | --- |
| index.html | Promotional banners, categories, featured products and the daily pick |
| products.html | Search, category filtering and product cards |
| cart.html | Cart items, quantity controls and totals |
| checkout.html | Delivery form, order summary and confirmation |
| wishlist.html | Saved products and Interested / Owned / Not Interested status |
| support.html | Feedback form and expandable FAQ answers |
| data.js | Product array; each object has an ID, name, category, price, image and description |
| app.js | Shared functions and page-specific setup |
| style.css | Colours, spacing, Flexbox, Grid, breakpoints and animations |
| manifest.json | App name, colours, start URL and installation icons |
| sw.js | Caches local files so visited/cached content is available offline |
| images/ | Local product photographs, original illustrations and app icons |
| preview.cjs | Development server; not needed on GitHub Pages |

## Functions to understand

1. `readList()` parses saved JSON into an array. Its try/catch handles damaged data.
2. `saveList()` converts an array into JSON text and writes it to localStorage.
3. `generateCards()` uses map and join to turn product objects into card HTML. The same function is reused on three pages.
4. `addToCart()` finds a product by its ID, adds one unit and saves the updated cart.
5. `cartRows()` counts repeated product IDs to display a quantity for each product. This keeps your original one-entry-per-unit cart structure.
6. `cartTotal()` adds the item prices in cents, then converts the result to dollars to avoid accumulating decimal rounding errors.
7. `setupProducts()` filters by product name and category together. `includes()` checks the search text, ignoring capitalisation.
8. `validateForm()` trims spaces and checks required fields, email format and minimum lengths before saving anything.
9. `setupForms()` handles newsletter, feedback and checkout submissions. Checkout saves an order before clearing the cart.
10. `setupHome()` selects a product using the current day number modulo the inventory length. It also uses a timer to rotate banners.

## Common questions

**Why localStorage?** It keeps data after a refresh and across pages on the same website. It stores strings, so we use JSON.stringify and JSON.parse. It belongs to this browser/device and is not a shared database.

**What is DOM manipulation?** JavaScript changes elements on the page, such as updating the cart count with textContent or inserting product cards into their container.

**Why event listeners?** They run code in response to input, clicks and form submissions. One shared click listener checks data-action on buttons. This also works for cards inserted after the page loads.

**What does preventDefault do?** It stops a form's normal page submission so our JavaScript can validate it and show a message.

**How is the layout responsive?** The base CSS uses a narrow layout. At 540px the product grid becomes two columns; at 850px it becomes four columns and the desktop navigation appears.

**How does the modal work?** The HTML dialog element opens with showModal and closes with close or Escape. The browser provides focus containment while it is open.

**What makes it accessible?** Labelled inputs, semantic page sections, real buttons, visible keyboard focus, a skip link, text alternatives for images, status messages and reduced-motion support.

**How does offline support work?** The service worker caches the listed files during installation. It tries the network first and returns the cached file if the network fails. Change CACHE_NAME when publishing changes to cached files.

## Practise these small changes yourself

- Add a product to inventory with a new unique ID.
- Change the accent colour in the CSS variables.
- Change the banner interval from 6000 milliseconds to 8000.
- Explain why two $49.99 items total $99.98.
- Demonstrate an invalid email, an empty cart and a saved wishlist status after refresh.

## Before submission

Product photos are stored locally as WebP files. data.js points to each image; the cards, modal and cart read that path. The homepage banners reuse four of these photos. IMAGE-CREDITS.md records the sources. Keep the credits with the submission.

Complete the formal testing in TESTING.md, prepare your own wireframes and submission document, and publish to the GitHub Pages repository required by your brief. No deployment was performed here. The brief contains an old July 2025 availability date; confirm the current submission schedule with your lecturer.
