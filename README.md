# Beard on the Roam

Off road, fishing, and camp life. Home of the **Get Lost** project.

Plain HTML, CSS, and JavaScript. No build step.

## Pages
| File | What it is |
|---|---|
| `index.html` | Home: hero, what we do, episodes, trail code, about teaser, follow links |
| `about.html` | The full story |
| `contact.html` | Email + contact form |

## Things to fill in later
Everything lives at the top of `assets/js/main.js` in the `SITE` block:

1. **YouTube / Instagram:** paste the full URLs into `social`. Every button on every page updates.
2. **Email:** put the address in `contactEmail`. It shows on the contact page and the form starts sending to it.
3. **Home banner:** lives at `assets/img/hero-banner.jpg`. To swap it, replace that file with a new one of the same shape (wide, logo centered). Delete it and the page falls back to the logo over a dark mountain backdrop.
4. **Episodes:** add `{ title, meta, url }` entries. Leave `thumb` empty and the YouTube thumbnail is used.

## Logo files (`assets/img`)
| File | Use |
|---|---|
| `wordmark.webp` / `.png` | Full logo with text, transparent background |
| `mark.webp` / `.png` | Mountain and beard only, transparent background |
| `logo-on-dark.webp`, `mark-on-dark.webp` | Versions on the dark textured background |
| `favicon-64.png`, `apple-touch-icon.png`, `icon-512.png` | Browser tab and phone home screen icons |
| `og-banner.jpg` | Preview image when the link is shared |
| `legacy/` | Original vector logo and illustrations, kept for reference |

### Contact form setup (one time)
The form uses [FormSubmit](https://formsubmit.co/) so no server is needed.
After you set `contactEmail` and publish, send one test message from the live site.
FormSubmit emails you an activation link. Click it, and every message after that lands in your inbox.

## Run it locally
Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
```

## Publish free with GitHub Pages
Repo **Settings > Pages > Deploy from a branch > main / root**.
Docs: https://docs.github.com/en/pages/getting-started-with-github-pages
