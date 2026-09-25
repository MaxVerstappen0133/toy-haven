# Toy Haven verified test record

Test date: 2026-09-24T16:02:41.872Z. Browser: Chrome 153.0.8010.53. Tested base: http://127.0.0.1:4173/

These are local preview results. GitHub Pages, WAVE, installation and real-device checks remain pending.

| ID | Test | Result |
| --- | --- | --- |
| T01 | Six pages and product photos | Pass |
| T02 | Search and category combination | Pass |
| T03 | Modal opens and Escape restores focus | Pass |
| T04 | Cart quantity totals and persistence | Pass |
| T05 | Decrease remove and clear cart | Pass |
| T06 | Empty checkout disabled | Pass |
| T07 | Invalid checkout then valid simulated order | Pass |
| T08 | Wishlist duplication and all statuses persist | Pass |
| T09 | Feedback and newsletter validation and saving | Pass |
| T10 | FAQ keyboard toggle | Pass |
| T11 | Banners and daily selection | Pass |
| T12 | Responsive layouts at 390 768 and 1440 pixels | Pass |
| T13 | Malformed saved JSON falls back safely | Pass |
| T14 | Offline catalogue and images | Pass |
| T15 | No uncaught JavaScript errors | Pass |

## Validation

- W3C HTML: all six pages returned zero messages.
- W3C CSS: zero errors, 66 warnings. Warnings require contextual review.
- axe-core: zero reported violations on all six pages. This is not a WAVE result.
- Local home Lighthouse: desktop 100/100/100/100; mobile 98/100/100/100 (Performance/Accessibility/Best Practices/SEO).

Evidence reports and screenshots are included separately in the submission package.

## Remaining checks

- Publish GitHub Pages and repeat the main flows on its HTTPS URL.
- Run WAVE and review alerts on all six pages.
- Verify PWA installation and test on a real phone and another browser.
- Test blocked storage, zoom, and checkout partial-storage-failure handling.

Product photo sources and rights notes are in IMAGE-CREDITS.md. Use dummy details for all tests.
