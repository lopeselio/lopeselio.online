# lopeselio.online

Personal site for Elio Jordan Lopes. It tells the story as a speedrun: each part of the journey is a
"split", and a split timer follows the reader down the page.

- **Stack:** Next.js (static export), React, [Motion](https://motion.dev) for scroll effects,
  [three.js](https://threejs.org) for the 3D scenes, plain CSS.
- **Analytics:** [Vercel Web Analytics](https://vercel.com/docs/analytics) (`<Analytics />` in `app/layout.tsx`).
  It only reports from the deployed site, not from `npm run dev`.
- **3D:** `components/Journey3D.tsx` draws the course behind the page: one checkpoint ring per chapter,
  built from `chapters`, so a new chapter gets its own ring automatically. Scrolling flies the camera down
  the track, the pointer scatters the blocks, and clicking a ring jumps to its chapter.
  `components/LaunchField.tsx` is the galaxy behind the `feature` chapter. Both fall back to the plain page
  if WebGL isn't available, and slow down for people who ask for reduced motion.
- **Content:** every word, number and link lives in [`content/site.ts`](content/site.ts).
- **Storyboard:** the reasoning behind each chapter, and facts still to confirm, are in
  [`docs/STORYBOARD.md`](docs/STORYBOARD.md).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000, reloads as you edit
npm run build      # writes the finished static site to out/
npm start          # serves out/ to check the production build
```

Needs Node 20 or newer.

## Updating the site

You should rarely need to touch anything outside `content/site.ts`.

| To change | Edit |
| --- | --- |
| Intro, email, social links | `profile` |
| A chapter's text, numbers or links | that entry in `chapters` |
| The project list | `work` (newest first) |
| Community lines, closing message | `community`, `closing` |
| The CV people download | replace `public/Elio_Jordan_Lopes_CV.pdf` (keep the name) |
| Photos and clips | add files to `public/media/` and list them in a chapter's `media` (the first is shown largest on phones) |
| The photo ring before Contact | `moments` |
| A chapter's photos as a moving, draggable strip | set `mediaLayout: "carousel"` on that chapter |
| Your photo in the header | `profile.portrait` |

### Add a chapter

Add an object to `chapters` in the order it happened:

```ts
{
  id: "next-thing",          // used in the URL, e.g. lopeselio.online/#next-thing
  split: "Next thing",       // short name in the split timer
  when: "Mar 2027",          // shown on the timer as you reach the chapter
  title: "What happened, in a sentence",
  story: ["First paragraph.", "Second paragraph."],
  facts: ["Short fact", "Another fact"],                     // optional
  stats: [{ value: 1200, suffix: "+", label: "players" }],   // optional
  links: [{ label: "Demo", href: "https://..." }],           // optional
  media: [                                                   // optional
    { kind: "photo", src: "/media/file.jpg", alt: "Describe the image", caption: "Where and when" },
    { kind: "video", src: "/media/clip.mp4", poster: "/media/clip-poster.jpg", alt: "Describe the clip" },
  ],
  gold: true,                // optional: marks a 1st-place finish on the timer
}
```

The timer, numbering and navigation update themselves.

Two rules keep the design working:

- **Only one chapter has `feature: true`.** It's the dark, full-width climax with counting numbers
  (currently the Cryptara Conquest launch). Move the flag if a bigger moment comes along.
- **Use `gold` only for 1st-place finishes**, which is what the diamond on the timer means.

## Deploying to lopeselio.online

The build is a plain static site, so any host works. Vercel is the simplest:

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project**, import the repository and keep the detected Next.js
   settings.
3. In the project's **Settings → Domains**, add `lopeselio.online` and `www.lopeselio.online`.
4. At your domain registrar, add the DNS records Vercel shows you. For a root domain this is
   usually an `A` record pointing to Vercel's IP, plus a `CNAME` for `www`. Use the exact values
   Vercel displays, since they can change.

Every push to the main branch then redeploys the site.

## Design notes

- **Colour:** cool paper `#EEF2F6`, ink `#0E1726` (the navy from the CV), slate `#5B6578`,
  signal orange `#F26A1B`. Tokens are at the top of `app/globals.css`.
- **Type:** one family, Archivo. Its width axis is the main device: the name widens on load, and
  chapter titles widen as they scroll into place.
- **Motion:** the split timer, the widening titles and the launch counters. Everything else is
  still. All of it switches off when the visitor's system asks for reduced motion.
- **Small screens:** the split panel turns into a progress bar along the top.

## Files

```
app/layout.tsx          fonts, page title, social preview
app/page.tsx            page structure
app/globals.css         all styling
components/Run.tsx      the split timer and the chapter wrapper
components/ChapterSection.tsx  one chapter
components/WidenTitle.tsx      chapter titles that widen on scroll
components/Counter.tsx         numbers that count up in the launch chapter
content/site.ts         all the words
public/                 CV, images
```

## Photos and video

Clips are short, silent and looping, and only play while on screen. To add one, convert it first so it
stays small (about 1-3 MB):

```bash
ffmpeg -i input.mp4 -an -vf scale=960:-2 -c:v libx264 -crf 27 -pix_fmt yuv420p -movflags +faststart public/media/clip.mp4
ffmpeg -ss 1 -i public/media/clip.mp4 -frames:v 1 public/media/clip-poster.jpg
```

The Instagram photos in `public/media/` came from @lopeselio_ posts. The Terrace, Sushi Nads and Cryptara
Conquest clips were cut from the videos in those project folders.
