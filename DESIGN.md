# Design System: Kinetic Precision

Generated from Stitch Project: **PaddleTournament Pro Organizer** (2054448790505929300)

## 1. Overview
**Creative North Star: "The High-Velocity Arena"**  
The design is engineered to capture the raw energy of professional racket sports. It features aggressive, condensed typography and sophisticated tonal layering, moving beyond generic dark modes to create a stadium-match atmosphere.

---

## 2. Color Palette

### Core Palette (Tokens)
- **Primary:** `#75FF9E` (Electric Green / Pickleball)
- **Secondary:** `#FFB59D` (Burnished Orange / Padel)
- **Tertiary:** `#DAE4FF` (Velocity Blue / Tournament Logic)
- **Background:** `#131313` (The Void)
- **Surface:** `#131313`
- **Surface Container (Card Level):** `#2A2A2A`

### Sport-Specific Signaling
- **Pickleball:** `#00E676`
- **Padel:** `#FF6B35`
- **Velocity Blue:** `#3B8BFF`

### Design Rules
- **The "No-Line" Rule:** Do not use 1px solid borders for sectioning. Define boundaries through background tonal shifts.
- **Tonal Stacking:** Use color hex shifts (Surface -> Surface Container High) to denote hierarchy rather than traditional shadows.

---

## 3. Typography

### Editorial & Headlines
- **Font Family:** `Barlow Condensed` (Bold)
- **Usage:** High-impact tournament titles, scores, and names.
- **Style:** All-caps, aggressive tracking (-2%).

### Body & UI
- **Font Family:** `Plus Jakarta Sans`
- **Usage:** Player bios, match details, settings, and general interface text.
- **Characteristics:** High legibility in low-light (dark mode) environments.

### Data & Scores
- **Font Family:** `Roboto Mono`
- **Usage:** Live scores, timers, and statistical data.
- **Rationale:** Monospaced alignment prevents layout "jumping" during live updates.

---

## 4. UI Components

- **Corner Roundness:** `6px` (Medium/Round Four)
- **Inputs:** Use `#2A2A2A` surface with a 2px bottom-only glow color based on the current sport (Green/Orange).
- **Modals:** Always implement as **Bottom Sheets** with `14px` top corner radius and heavy backdrop blur.
