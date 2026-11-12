# Arun — Portfolio Website

> Senior Web Developer & Project Manager | 15+ Years | Kerala, India | Open to Ireland

## 🗂️ Project Structure

```
portfolio/
├── index.html                    ← Main portfolio page
├── README.md                     ← This file
├── .gitignore
├── assets/
│   ├── css/
│   │   ├── style.css             ← Main stylesheet (WCAG AAA, custom props, responsive)
│   │   ├── animations.css        ← Scroll-reveal, keyframes, stagger delays
│   │   └── case-study.css        ← Case study / detail page styles
│   ├── js/
│   │   └── main.js               ← All interactive JS (cursor, typewriter, filter, form…)
│   └── images/
│       ├── arun-profile.jpg      ← ⚠️ ADD YOUR PHOTO HERE
│       ├── arun-about.jpg        ← ⚠️ ADD YOUR ABOUT PHOTO HERE
│       └── projects/
│           ├── p01-thumb-1.jpg   ← Project 1 — image 1
│           ├── p01-thumb-2.jpg   ← Project 1 — image 2
│           ├── p01-thumb-3.jpg   ← Project 1 — image 3
│           ├── p02-thumb-*.jpg   ← Project 2 thumbnails
│           └── ...               ← Add more as needed
└── work/
    ├── project-01.html           ← Case study template (duplicate for each project)
    ├── project-02.html
    ├── project-03.html
    ├── project-04.html
    ├── project-05.html
    └── project-06.html
```

---

## ✅ What's Built In

| Feature | Details |
|---|---|
| **WCAG AAA** | Skip link, ARIA labels, keyboard nav, focus states, colour contrast 7:1+, `forced-colors` support |
| **Responsive** | Mobile-first, breakpoints at 480/768/1024px |
| **Animations** | Particle canvas, typewriter, counter, scroll-reveal, floating badges, marquee |
| **Custom cursor** | Desktop-only, respects `hover: none` |
| **Preloader** | Brand-logo preloader with progress bar |
| **Portfolio filter** | ARIA tab-role filter by platform category |
| **Thumbnail switcher** | Auto-cycling 2-3 images per project card with dot nav |
| **Case studies** | Full detail page with breadcrumb, gallery grid, results cards, sidebar |
| **Contact form** | Client-side validation with ARIA live regions |
| **Print CSS** | Clean print layout |
| **Reduced motion** | All animations respect `prefers-reduced-motion` |
| **Git-ready** | Flat HTML/CSS/JS — deploy to GitHub Pages instantly |

---

## 🚀 How to Deploy to GitHub Pages

```bash
# 1. Initialise git (if not already)
git init
git add .
git commit -m "Initial portfolio commit"

# 2. Create a GitHub repo named: YOUR-USERNAME.github.io
# Then push:
git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
git branch -M main
git push -u origin main

# 3. Go to GitHub → Settings → Pages → Source: main branch
# Live URL: https://YOUR-USERNAME.github.io
```

---

## 📝 What You Need to Update

### Personal info (index.html)
- [ ] Replace `YOUR-PROFILE` in LinkedIn URL
- [ ] Replace `YOUR-HANDLE` in GitHub URL
- [ ] Add your real phone country code if needed
- [ ] Update Suyindya employment years (`20XX`)

### Photos
- [ ] `assets/images/arun-profile.jpg` — your headshot (1:1, min 640×640px)
- [ ] `assets/images/arun-about.jpg` — at-work photo (4:5 ratio recommended)
- [ ] Optimise all images with [Squoosh](https://squoosh.app) (WebP, <100 KB ideally)

### Projects (index.html portfolio grid)
For each of the 6 project cards, update:
- [ ] `data-category` attribute → `wordpress` / `shopify` / `webflow` / `duda` / `html`
- [ ] `aria-label` → real project name
- [ ] `<img alt="">` attributes → describe each screenshot
- [ ] `<h3>` title, description, platform tags
- [ ] Stats (conversion %, Lighthouse score, etc.)
- [ ] `href` → link to your live site or case study page

### Case studies (`work/project-XX.html`)
Duplicate `project-01.html` for each project and fill in:
- [ ] `<title>` and `<meta name="description">`
- [ ] Breadcrumb project name
- [ ] Tags, title, summary, meta table
- [ ] Gallery images
- [ ] Challenge, Approach, Results sections
- [ ] Tech stack and services sidebar
- [ ] Prev/Next navigation links
- [ ] Result metrics (the coloured stat cards)

### CV
- [ ] Put your CV PDF at `assets/Arun-CV.pdf`

### Testimonials
- [ ] Replace placeholder quotes with real client testimonials
- [ ] Update avatar initials and names

### Contact form
- [ ] Integrate a real backend: [Formspree](https://formspree.io) (free), [EmailJS](https://www.emailjs.com), or Netlify Forms
- [ ] In `main.js` → section 12, replace the `setTimeout` with a real `fetch()` call

---

## 🎨 Customising the Theme

All design tokens live in CSS custom properties at the top of `style.css`:

```css
:root {
  --clr-accent:  #6c63ff;   /* Purple — change to your brand colour */
  --clr-accent-2: #ff6584;  /* Pink accent */
  --clr-accent-3: #43e97b;  /* Green accent */
  --ff-display: 'Syne', ...;/* Heading font */
  --ff-sans:   'Inter', ...; /* Body font */
}
```

---

## 📦 Recommended Image Sizes

| Image | Recommended size | Format |
|---|---|---|
| Profile photo | 640×640px | WebP / JPEG |
| About photo | 960×1200px | WebP / JPEG |
| Project thumbnails | 1440×960px | WebP / JPEG |
| Case study main | 1600×1200px | WebP / JPEG |
| Case study small | 800×600px | WebP / JPEG |

---

## 🌐 Browser Support

Chrome 90+, Firefox 90+, Safari 14+, Edge 90+. Degrades gracefully in older browsers.

---

*Built by Antigravity AI for Arun — November 2026*
