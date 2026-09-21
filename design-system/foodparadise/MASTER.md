# Food Paradise — Design System (MASTER)

Generated from the **ui-ux-pro-max** skill (nextlevelbuilder/ui-ux-pro-max-skill, v2.0 reasoning
data) for product type: **Food E-commerce / Restaurant & Food Service**, inspired by the
warm cream/terracotta aesthetic of the "Ecommerce Website Design for Crockery & Kitchenware
Brands" Dribbble shot.

## PATTERN
- **Hero-Centric + Conversion + Social Proof**
- Conversion: appetite-driven — high-quality food imagery above the fold, CTA repeated after trust sections
- Sections order:
  1. Announcement bar (delivery offer + hours)
  2. Nav (sticky, translucent cream)
  3. Hero (full-bleed slideshow + headline + primary/secondary CTA + rating)
  4. Trust strip (fresh / fast / chef-crafted / secure)
  5. Featured dishes (category chips + product card grid)
  6. Why choose us (image collage + proof points + CTA)
  7. Chef spotlight (carousel card)
  8. Testimonials (social proof cards)
  9. Final CTA band
  10. Footer (dark warm brown)
- Cart: right-side drawer with backdrop, qty steppers, totals, disabled checkout when empty

## STYLE
- **Organic Biophilic + Soft UI Evolution**
- Keywords: earthy, warm, rounded (16–24px cards), natural soft shadows, generous whitespace,
  subtle depth (flat-design-without-depth is an anti-pattern)
- Motion: 200–300ms ease transitions, card hover lift + image zoom (1.05), scroll-reveal
  fade-up, no parallax overkill
- Anti-patterns to avoid: bright neon, AI purple/pink gradients, dark mode by default,
  low-quality imagery, heavy/looping animations, emoji used as UI icons

## COLORS
| Token | Value | Usage |
|---|---|---|
| --bg | #FAF5EE | Page background (warm cream) |
| --bg-alt | #F3EAE0 | Alternating section background |
| --surface | #FFFFFF | Cards, drawer |
| --ink | #2B211C | Headings, primary text (≈13:1 on bg) |
| --ink-soft | #6E6259 | Secondary text (≈4.9:1 on bg) |
| --clay | #A84E2A | Primary/CTA (≈5.4:1 on white; white text OK) |
| --clay-dark | #8C3E1F | CTA hover |
| --clay-soft | #F3DDD2 | Tinted fills, active chips |
| --sage | #5C7152 | Secondary accent, category tags (white text OK) |
| --sage-soft | #E7EDE2 | Tinted fills |
| --gold | #D9A441 | Ratings, badges (large/decorative only, not small text) |
| --line | #E8DFD3 | Hairline borders |
| --footer-bg | #241B15 | Footer background (cream text on it) |

Rules: CTA always clay with white text; badges never rely on color alone (include icon/label);
body text on cream must be --ink or darker.

## TYPOGRAPHY
- **Display:** Playfair Display (600/700) — serif, for H1/H2, hero, logo
- **Body/UI:** Karla (400–700) — for body, buttons, labels, nav
- Google Fonts:
  `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Karla:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap`
- Scale: hero clamp(2.5rem, 5.5vw, 4.2rem) · h2 clamp(1.9rem, 3.2vw, 2.6rem) ·
  h3 1.25–1.4rem · body 1rem/1.6 · eyebrow 0.75rem uppercase ls-2 600
- Icons: Boxicons (already loaded) — never emoji as icons

## KEY EFFECTS
- Cards: radius 20px, shadow `0 8px 32px rgba(43,33,28,.08)`, hover lift `-4px` +
  `0 16px 40px rgba(43,33,28,.14)`, image zoom 1.05 (200–300ms)
- Chips/buttons: pill radius 999px
- Focus: 2px solid --clay outline, 2px offset, on all interactive elements
- `prefers-reduced-motion: reduce` → disable autoplay, scroll-reveal, smooth scroll, hovers scale

## PRE-DELIVERY CHECKLIST
- [x] No emojis as icons (Boxicons/Font Awesome)
- [x] cursor-pointer on all clickable elements
- [x] Interaction timing 200–300ms
- [x] Light mode contrast ≥ 4.5:1 for text
- [x] Visible focus states for keyboard nav
- [x] prefers-reduced-motion respected
- [x] Labels/badges reflow without clipping (chips wrap)
- [x] Responsive: 375px, 768px, 1024px, 1440px
- [x] All JS hooks (ids/classes used by script.js) preserved
