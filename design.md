# design.md visual spec

Visual language and component specs for the portfolio. Read this before any UI work.

## Principles

Restrained, typographic, honest. One accent color, a lot of whitespace, a clear grid.

- **One accent.** Coral is used only for the hero ring and glow, small markers (squares, rules, underlines), section labels, the primary button, and focus outlines. No other hues: no purple, violet, indigo, teal or second brand color.
- **Flat surfaces.** No gradient backgrounds, gradient text, shadows, blur or glass effects. There are two exceptions: the hero glow (radial, ≤16% opacity) and the edge mask on the portrait.
- **Small radii.** Buttons and frames use `rounded-xs` (2px) or no radius. `rounded-full` is only for the ring and the glow. Nothing is pill-shaped. Exception: the mobile navbar card (12px) and its menu button (8px).
- **Few borders.** Separate content with whitespace and single 1px hairlines (`border-line`). Don't box every element, don't nest cards, and don't use bento grids.
- **Plain text over decoration.** Tech lists are text separated by ` · `. Don't use chips, logo icons, emoji, illustrations or decorative shapes. Exception: the tech-stack strip shows devicon logos in their brand colors (see below).
- **Honest content.** No metrics, counters or claims that aren't in the content files. Missing data stays a `[PLACEHOLDER]`.
- **Black-and-white portrait.** The photo is always `grayscale`. Color sits around it, never on it.
- **Quiet motion.** Use a fade/rise on load (hero), on first scroll into view (section headers, project rows) and when the mobile menu opens, and nothing else. Respect `prefers-reduced-motion`.

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
  --color-dim: #7D8696;          /* small mono labels, lowest allowed text contrast */
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
- Large screens: custom breakpoint `3xl` (`--breakpoint-3xl: 160rem`, 2560px). From there `html` gets `zoom: 1.3333` (2560 / 1920), so a 2K screen shows exactly the FullHD layout instead of a smaller-looking page. Components don't need their own `3xl:` overrides. Raster images must list the zoomed size in `sizes` (e.g. the portrait: `(min-width: 2560px) 720px`).
- Vertical rhythm: about 120–140px between major sections on desktop and 64–80px on mobile.
- Two-column sections (About, Experience) use a narrow left column (label + H2) and a wide right column (content) in roughly a 1 : 1.6 ratio, stacked on mobile.
- Background bands: the tech-stack strip and the Experience section are full-bleed `bg-ink-2`. Everything else sits on `ink`.

---

## Components

### Navbar (fixed)

- Left: `Milan Nikolić` followed by an accent `.` (semibold). Right: About, Projects, Experience, Contact.
- Links use the `/#about` form so they also work from case-study pages.
- `html { scroll-behavior: smooth; scroll-padding-top: 88px }`. Turn smooth scrolling off under reduced motion.

**Desktop (≥ md):** a full-width bar, `fixed inset-x-0 top-0 z-50`, 72px tall.
- Links: 15px semibold, `text-fg-soft/80 hover:text-fg`.
- **At the top of the page:** transparent, no border. **After scrolling ~16px:** `bg-ink` plus `border-b border-line`, with a 200ms color transition. No blur, no shadow. An `IntersectionObserver` on a 1px sentinel at the top of `<body>` toggles `data-scrolled` on `<header>`.
- **Active section** (home page only): an IntersectionObserver on the sections sets `aria-current="true"`. The active link is `text-fg` with a 2px accent underline.

**Mobile (< md):** a floating card, `fixed inset-x-3 top-3`, 60px tall, `rounded-[12px] border border-line-strong bg-ink`, always solid (no scroll state). Its inner padding lines the logo up with the 24px page gutter.
- Menu button: 44×44, `rounded-[8px] border border-line bg-surface`, inline stroke SVG (hamburger ↔ X), `aria-label="Open menu" aria-expanded aria-controls="mobile-menu"`.
- Open: the menu expands inside the card below a hairline: 56px rows, 20px semibold `text-fg-soft/80` (active/hover `text-fg`), a small `text-dim` "→" on the right, hairlines between rows. A scrim (`bg-ink/85`, no blur) dims the page behind it; tapping it closes the menu.
- Close on link click, Escape, the button, the scrim, or a resize to ≥ md. Lock body scroll while it's open. Move focus to the first link on open and back to the button on close.
- Opening animation (none under reduced motion): the card grows open (max-height, 320ms), links fade/rise 6px one after another (45ms stagger), the scrim fades in (220ms), the X turns in from -90°.
- The hero has 72px top padding on every size, so content clears both the desktop bar and the mobile card.

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

`bg-ink-2` with hairlines top and bottom. Each item is a logo above its name:
- Logo: devicon SVG inlined at build time (`src/data/techIcons.ts`), original fills stripped, `fill="currentColor"`, colored with its brand color (`brand` in `techIcons.ts`, set as `--tech-brand` on the item), 28px (md 32px), `aria-hidden`.
- Name: sans 13px, `text-subtle`, centered. No hover state.
- This strip is the only place hues other than coral appear.
- Layout: centered `flex-wrap` with fixed item widths (100px, md 124px), so 3 per row on mobile and 5 + 5 on tablet; one `justify-between` row from `xl`.

### About

Left: section label + H2. Right: lead paragraph, a second paragraph in `text-muted`, then a 2×2 `<dl>` with a hairline above it (labels mono 12px uppercase `text-dim`, values 17px `text-fg`).

### Projects

- Header row: label + H2 on the left, a short note (max ~340px) on the right, hairline below.
- `ProjectRow` text column: mono "01 / kind", H3, summary, a mono stack line in `text-subtle`, then links. "Live site ↗" has a 2px accent underline and "GitHub ↗" a 2px `line-strong` underline. "Case study →" appears only when the project has one.
- `ProjectRow` screenshot column: `bg-surface rounded-xs`. A cover keeps its own aspect ratio (no `object-cover` cropping, which upscales and blurs UI screenshots); use the same size for all covers so rows match (currently 1914×965). Covers are served as WebP at quality 90 with widths up to the original. With no image, the column shows a 16:10 frame with a centered mono label like `[codewithmixx screenshot]`.
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
