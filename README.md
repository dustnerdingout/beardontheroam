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
3. **Episodes:** add `{ title, meta, url }` entries. Leave `thumb` empty and the YouTube thumbnail is used.

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
