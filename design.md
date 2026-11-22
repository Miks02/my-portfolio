# design.md — visual spec

Visual language and component specs for the portfolio. Read this before any UI work.

## Principles

Restrained, typographic, honest. One accent color, a lot of whitespace, a clear grid.

- **One accent.** Coral is used only for the hero ring and glow, small markers (squares, rules, underlines), section labels, the primary button, and focus outlines. No other hues: no purple, violet, indigo, teal or second brand color.
- **Flat surfaces.** No gradient backgrounds, gradient text, shadows, blur or glass effects. There are two exceptions: the hero glow (radial, ≤16% opacity) and the edge mask on the portrait.
- **Small radii.** Buttons and frames use `rounded-xs` (2px) or no radius. `rounded-full` is only for the ring and the glow. Nothing is pill-shaped.
- **Few borders.** Separate content with whitespace and single 1px hairlines (`border-line`). Don't box every element, don't nest cards, and don't use bento grids.
- **Plain text over decoration.** Tech lists are text separated by ` · `. Don't use chips, logo icons, emoji, illustrations or decorative shapes.
- **Honest content.** No metrics, counters or claims that aren't in the content files. Missing data stays a `[PLACEHOLDER]`.
- **Black-and-white portrait.** The photo is always `grayscale`. Color sits around it, never on it.
- **Quiet motion.** Use a fade/rise on load (hero) and on first scroll into view (section headers, project rows), and nothing else. Respect `prefers-reduced-motion`.

Design lint: run this before finishing UI work. It should return nothing unless an exception is commented.

```bash
grep -rnE "purple|violet|indigo|bg-linear|bg-gradient|backdrop-blur|shadow-|rounded-(lg|xl|2xl|3xl)" src/
```

---

## Tokens (`src/styles/global.css`)

```css
@import "tailwindcss";
@import "@fontsource-variable/schibsted-grotesk";
@import "@fontsource-variable/jetbrains-mono";

@theme {
  --color-ink: #11161E;          /* page background */
  --color-ink-2: #151B24;        /* tech-stack strip, experience band */
  --color-surface: #19202B;      /* screenshot frames */
  --color-line: #232B37;         /* hairlines */
  --color-line-strong: #3A4352;  /* secondary button border, inactive underline */
  --color-fg: #F1EEE8;           /* primary text */
  --color-fg-soft: #E4E0D9;      /* lead paragraph */
  --color-muted: #A0A8B6;        /* body text */
  --color-subtle: #8F98A7;       /* tech lists */
  --color-dim: #7D8696;          /* small mono labels — lowest allowed text contrast */
  --color-accent: #F26B4A;       /* coral */

  --font-sans: "Schibsted Grotesk Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, monospace;
}
```

- Components use token utilities (`bg-ink`, `text-muted`, `border-line`, `text-accent`…), never raw hex.
- Text on `bg-accent` is `text-ink`.
- No text color darker than `dim` on `ink` (keeps contrast ≥ 4.5:1).
- Timeline-only values: rule `#2C3441`, inactive marker border `#5A6475`. Add them as tokens if they're reused.

## Typography

| Role | Style |
|---|---|
| H1 (name) | sans 600, `text-[clamp(56px,7vw,96px)]`, `leading-[0.95]`, `tracking-[-0.035em]`; 58px on mobile |
| Title "Software Engineer" | sans 500, 28px (mobile 22px), preceded by a 56×2px accent rule (mobile 40px) |
| H2 (section) | sans 600, 48px (mobile 34px), `leading-[1.05]`, `tracking-[-0.03em]` |
| H3 (project) | sans 600, 40px (mobile 30px), `tracking-[-0.025em]` |
| Section label | mono 13px (mobile 12px), uppercase, `tracking-[0.06em]`, `text-accent`, format `01 / ABOUT` |
| Meta / dates | mono 12–13px, `text-dim` or `text-muted` |
| Body | sans 17–18px, `leading-[1.65]`, `text-muted` |
| Lead paragraph | sans 20px (mobile 17px), `text-fg-soft` |

## Layout

- Container: `max-w-[1200px] mx-auto px-6 md:px-12`.
- Vertical rhythm: about 120–140px between major sections on desktop and 64–80px on mobile.
- Two-column sections (About, Experience) use a narrow left column (label + H2) and a wide right column (content) in roughly a 1 : 1.6 ratio, stacked on mobile.
- Background bands: the tech-stack strip and the Experience section are full-bleed `bg-ink-2`. Everything else sits on `ink`.

---

## Components

### Navbar (fixed)

- `fixed inset-x-0 top-0 z-50`, 72px tall (64px on mobile). Left: `Milan Nikolić` followed by an accent `.`. Right: About, Projects, Experience, Contact.
- **At the top of the page:** transparent, no border. **After scrolling ~16px:** `bg-ink` plus `border-b border-line`, with a 200ms color transition. No blur, no shadow.
  Use an `IntersectionObserver` on a 1px sentinel at the top of `<body>` that toggles `data-scrolled` on `<header>`.
- **Active section** (home page only): an IntersectionObserver on the sections sets `aria-current="true"`. Active link is `text-fg` with a 2px accent underline. Other links are `text-muted hover:text-fg`.
- Links use the `/#about` form so they also work from case-study pages.
- `html { scroll-behavior: smooth; scroll-padding-top: 88px }`. Turn smooth scrolling off under reduced motion.
- **Mobile (< md):** a hamburger `<button aria-label="Open menu" aria-expanded aria-controls="mobile-menu">` with a 44×44 hit area and an inline stroke SVG. It opens a full-width solid `bg-ink` panel under the bar with 24px links in 56px rows, separated by hairlines. Opening the panel forces the solid navbar state. Close it on link click, Escape, the button, or a resize to ≥ md. Lock body scroll while it's open. Move focus to the first link on open and back to the button on close.
- The hero has top padding equal to the navbar height.

### Hero

Two columns on desktop: text (`flex-1`) and a portrait column 540px wide × 600px tall. On mobile they stack, text first and portrait below.

Left column, top to bottom:
- Mono label: 8px accent square + "Belgrade, Serbia"
- H1 "Milan / Nikolić" (with a line break)
- Accent rule + "Software Engineer"
- One-line description (max ~440px wide)
- Buttons:
  - **Get in touch** (primary): `bg-accent text-ink`, links to `#contact`
  - **Resume** (secondary): 1px `border-line-strong`, download icon, `/resume.pdf` opened in a new tab
  - Both: `rounded-xs`, min-height 48px, 26px horizontal padding. On mobile they sit side by side, each half width.

**Portrait (`PortraitRing.astro`).** Positions are relative to the portrait box:

| Element | Desktop (540×600 box) | Mobile (340×380 box, centered) |
|---|---|---|
| Glow | 780px circle, `left:-142px top:23px` | 520px, `left:-104px top:8px` |
| Ring | 400px circle, 26px solid accent border, `left:48px top:190px` | 250px, 17px border, `left:31px top:124px` |
| Photo | 540px wide, `left:0 bottom:0` | 340px wide, `left:0 bottom:0` |

- Glow: `radial-gradient(circle, accent/16% 0%, accent/6% 38%, transparent 66%)`.
- Stacking order is glow, then ring, then photo. The head rises above the top of the ring and the sweater covers the lower half.
- The photo's bottom edge is flush with the bottom of the hero, where the tech-stack strip starts. The hero is `overflow-hidden`.
- The PNG is cut at the shoulders, so soften its sides with
  `mask-image: linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)`.
- Load animation: label, H1, title, text and buttons rise 14px and fade in over 800ms, staggered 80ms each.

### Tech stack strip

`bg-ink-2` with hairlines top and bottom. One row of plain-text items in `text-subtle` 16px, `justify-between`, wrapping on small screens.

### About

Left: section label + H2. Right: lead paragraph, a second paragraph in `text-muted`, then a 2×2 `<dl>` with a hairline above it (labels mono 12px uppercase `text-dim`, values 17px `text-fg`).

### Projects

- Header row: label + H2 on the left, a short note (max ~340px) on the right, hairline below.
- `ProjectRow` text column: mono "01 — kind", H3, summary, a mono stack line in `text-subtle`, then links. "Live site ↗" has a 2px accent underline and "GitHub ↗" a 2px `line-strong` underline. "Case study →" appears only when the project has one.
- `ProjectRow` screenshot column: a 16:10 frame, `bg-surface rounded-xs`. With no image, it shows a centered mono label like `[project screenshot]`.
- Rows are separated by hairlines. On mobile the screenshot sits above the text.

### Experience & Education

Full-bleed `bg-ink-2` band. Left: label + H2. Right: an `<ol>` with a 1px left rule and 9px square markers. The current item's marker is filled with the accent; the others are outlined. Each item has a mono period, an H3 title (22px, mobile 19px) and an org line in `text-muted`.

### Contact

Label, a large H2 (`clamp(44px,5.6vw,76px)`, 42px on mobile), a short paragraph, a large email link (30px, mobile 22px) with a 2px accent underline, then plain links to GitHub, LinkedIn and codewithmixx. No form.

### Footer

Hairline on top. Mono 12px `text-dim`: "© {year} Milan Nikolić" on the left, "Belgrade, Serbia" on the right.

### Case study page

Back link "← All projects", mono kind label, H1 title, summary, a meta row (stack · live · GitHub), the cover frame, then the Markdown body at ~68ch. Body styles live in a small `.prose-case` block in `global.css` (headings, p, lists, code, blockquote, hr) built from the tokens above.

### Reveal on scroll

- Elements with `data-reveal` start at `opacity:0; translateY(14px)`, but only when `<html>` has the `js` class (set inline in `<head>`), so content stays visible without JS.
- An IntersectionObserver (threshold ~0.15, fires once) adds `data-revealed`, which transitions over 600–800ms with ease-out.
- Use it on section headers and project rows, not on every paragraph.
- Under `prefers-reduced-motion: reduce`, there are no transforms or transitions.

### Focus & targets

- Focus style everywhere: `focus-visible:outline-2 outline-offset-4 outline-accent`.
- Interactive targets are at least 44px.
