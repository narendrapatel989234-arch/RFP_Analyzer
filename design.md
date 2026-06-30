# Design System Reference — Inception42 RFP Responder

This file is the single source of truth for all UI decisions in this project.
Every screen, component, and interaction must be validated against these rules before implementation.

---

## 1. Design Tokens — Usage Contract

### Layer hierarchy (innermost wins)

```
primitives.css  →  brand.css  →  light.css / dark.css  →  component styles
```

**Rule:** Components must only reference semantic tokens (`--bg-*`, `--text-*`, `--border-*`, `--action-*`, `--status-*`). Never reference primitive tokens (e.g. `--colors-action-green`) or raw hex values directly in component CSS.

### Token reference cheat-sheet

| Purpose              | Token                             |
| -------------------- | --------------------------------- |
| Page background      | `--bg-page`                       |
| Card / panel surface | `--bg-surface-1`                  |
| Sidebar              | `--bg-sidebar`                    |
| Input background     | `--bg-input`                      |
| Modal / overlay bg   | `--bg-modal`                      |
| Hover state bg       | `--bg-hover`                      |
| Selected state bg    | `--bg-selected`                   |
| Disabled bg          | `--bg-disabled`                   |
| Primary text         | `--text-primary`                  |
| Secondary text       | `--text-secondary`                |
| Placeholder          | `--text-placeholder`              |
| Disabled text        | `--text-disabled`                 |
| AI-generated label   | `--text-ai`                       |
| Accent / link        | `--text-accent` / `--text-link`   |
| Default border       | `--border-default`                |
| Focus ring border    | `--border-focus`                  |
| Primary CTA bg       | `--action-primary-bg-default`     |
| Primary CTA text     | `--action-primary-text`           |
| AI action bg         | `--action-ai-bg-default`          |
| AI action text       | `--action-ai-text`                |
| Destructive action   | `--action-destructive-bg-default` |
| Secondary action     | `--action-secondary-bg-default`   |

---

## 2. Color Rules

### Brand colors

| Color              | Hex       | Usage                                              |
| ------------------ | --------- | -------------------------------------------------- |
| Progress Green     | `#91FF01` | Primary actions, focus rings, success states, CTAs |
| Intelligent Purple | `#AE74FF` | AI-generated content, AI actions, AI badges        |
| Foundation Black   | `#1E1F1E` | Dark surfaces, text-on-light                       |
| Clarity White      | `#FBF8FF` | Light surfaces, text-on-dark                       |
| Technical Grey     | `#C2C8D6` | Neutral mid-tone, dividers, inactive states        |

### Supplementary status colors

| Color | Hex       | Usage                      |
| ----- | --------- | -------------------------- |
| Blue  | `#4D9FFF` | Info states only           |
| Amber | `#FFB020` | Warning states only        |
| Red   | `#FF4D4D` | Danger / error states only |

### Critical accessibility rule — text on brand fills

Progress Green and Intelligent Purple are **high-luminance**. White text fails contrast on both.

- Text on green fill → always `--action-primary-text` (Foundation Black `#1E1F1E`)
- Text on purple fill → always `--action-ai-text` (Foundation Black `#1E1F1E`)
- Never place `--text-inverse` (white) on green or purple backgrounds
- Verify every new component that paints text over these fills

### Color usage ratio

Per brand guidelines: Green / Purple / Grey should account for ~85% of color usage. Foundation Black is reserved for ~15% (surfaces, heavy backgrounds).

---

## 3. Typography

### Font families

| Role               | Font    | Fallback                           |
| ------------------ | ------- | ---------------------------------- |
| Display / headings | Lineca  | Poppins, -apple-system, sans-serif |
| Body / UI          | Diatype | Inter, -apple-system, sans-serif   |

### Type scale

| Token         | Size | Usage                         |
| ------------- | ---- | ----------------------------- |
| `--text-xs`   | 11px | Labels, badges, captions      |
| `--text-sm`   | 13px | Secondary body, helper text   |
| `--text-base` | 15px | Primary body text             |
| `--text-md`   | 17px | Emphasized body, sub-headings |
| `--text-lg`   | 20px | Section headings              |
| `--text-xl`   | 24px | Page sub-titles               |
| `--text-2xl`  | 28px | Page titles                   |
| `--text-3xl`  | 34px | Hero / display headings       |

**Rule:** Do not use sizes below `--text-xs` (11px). Minimum readable size for any UI text is 11px.

### Weight usage

- `400` (regular) — body copy
- `500` (medium) — labels, nav items
- `600` (semibold) — sub-headings, emphasized UI
- `700` (bold) — page headings
- `900` (black) — display/hero only, use sparingly

### Line height

- Headings → `--leading-tight` (1.2) or `--leading-snug` (1.35)
- Body → `--leading-normal` (1.5)
- Long-form text → `--leading-relaxed` (1.65)

---

## 4. Surface & Elevation Rules

The UI uses clean solid surfaces — no glassmorphism, no backdrop-filter, no blur effects anywhere.

### Surface hierarchy

| Token            | Use for                                           |
| ---------------- | ------------------------------------------------- |
| `--bg-page`      | Page / app background                             |
| `--bg-surface-1` | Cards, panels, sidebar                            |
| `--bg-surface-2` | Table headers, nested sections, input backgrounds |
| `--bg-surface-3` | Chip backgrounds, hover overlays                  |
| `--bg-hover`     | Row hover, button hover overlays                  |
| `--bg-selected`  | Selected rows, active nav items                   |

### Rules

- **No `backdrop-filter` or `blur` anywhere** — not on cards, modals, nav, or any surface
- **No glass tokens** (`--bg-glass-*`, `--colors-glass-*`) — these exist in primitives but must not be used in components
- Cards and panels use `--bg-surface-1` with `--shadow-1` for elevation
- Modals use `--bg-surface-1` with `--shadow-3`
- All surfaces must have a solid, opaque background

### Shadow pairing

- Cards, panels → `--shadow-1`
- Modals, drawers, popovers → `--shadow-3`
- No shadow on flat list rows or table cells

---

## 5. Spacing & Sizing

Use the spacing scale exclusively. Do not introduce arbitrary px values.

| Token        | Value |
| ------------ | ----- |
| `--space-1`  | 4px   |
| `--space-2`  | 8px   |
| `--space-3`  | 12px  |
| `--space-4`  | 16px  |
| `--space-5`  | 20px  |
| `--space-6`  | 24px  |
| `--space-8`  | 32px  |
| `--space-10` | 40px  |
| `--space-12` | 48px  |
| `--space-16` | 64px  |

### Border radius

| Token           | Value  | Use for                      |
| --------------- | ------ | ---------------------------- |
| `--radius-xs`   | 6px    | Chips, badges, small tags    |
| `--radius-sm`   | 8px    | Buttons, inputs, small cards |
| `--radius-md`   | 12px   | Cards, panels                |
| `--radius-lg`   | 16px   | Large cards, modals          |
| `--radius-xl`   | 20px   | Sheets, drawers              |
| `--radius-2xl`  | 24px   | Hero containers              |
| `--radius-full` | 9999px | Pills, avatars, toggles      |

---

## 6. Interaction & Animation

### Duration

- Fast feedback (hover, focus) → `--duration-fast` (120ms)
- Standard transitions → `--duration-std` (200ms)
- Complex motions (modals, drawers) → `--duration-slow` (320ms)

### Easing

- Most transitions → `--ease-out` (decelerating, feels natural)
- Micro-bounce / delight → `--ease-spring` (overshoots slightly, use sparingly)
- Material-style → `--ease-calm` (smooth in-out)

### Rules

- Every interactive element must have a visible hover and focus state
- Focus rings use `--shadow-focus` (3px green glow) — never remove outline without replacing it
- Disabled states use `--bg-disabled` + `--text-disabled` + `cursor: not-allowed` — no opacity hacks
- Transitions must be applied on the element, not on `:hover` — so the exit transition plays

---

## 7. Focus & Keyboard Accessibility

- All interactive elements must be keyboard-reachable via `Tab`
- Focus order must follow visual reading order (top-left → bottom-right)
- Focus ring is always `--shadow-focus-primary` (green glow) for standard actions; `--shadow-focus-ai` (purple glow) for AI actions; `--shadow-focus-danger` for destructive actions
- Never use `outline: none` without an explicit replacement focus indicator
- Modal / drawer open → focus must move into the opened element
- Modal / drawer close → focus must return to the trigger element
- Dropdowns and popover menus must be dismissible via `Escape`
- Interactive elements in tables and lists must be individually focusable

---

## 8. Contrast & Readability (WCAG 2.1 AA minimum)

| Pairing                                 | Minimum ratio |
| --------------------------------------- | ------------- |
| Normal text on background               | 4.5:1         |
| Large text (18px+ regular / 14px+ bold) | 3:1           |
| UI component borders, icons             | 3:1           |

### Known safe pairings in this design system

- `--text-primary` on `--bg-page` → passes in both themes
- `--text-primary` on `--bg-surface-1` → passes in both themes
- Foundation Black on Progress Green → passes (verified by brand guidelines)
- Foundation Black on Intelligent Purple → passes (verified by brand guidelines)

### Known failures to avoid

- White or `--text-inverse` on Progress Green → fails
- White or `--text-inverse` on Intelligent Purple → fails
- `--text-secondary` on `--bg-surface-4` in dark theme → verify before use (low opacity combination)

---

## 9. AI Content Visual Language

AI-generated content must always be visually distinguished from user-authored content.

- AI-generated sections → use `--status-ai-bg` background + `--status-ai-border` border
- AI action buttons → use `--action-ai-bg-default` (purple) not green
- AI labels / badges → `--text-ai` color with a small "AI" or sparkle indicator
- Hallucination-flagged content → use `--status-warning-bg` + `--status-warning-border` + explicit warning label
- Do not use green (primary) for AI actions — green is human-initiated, purple is AI-initiated

---

## 10. Component States — Required Set

Every interactive component must handle all six states:

| State            | Visual requirement                                                          |
| ---------------- | --------------------------------------------------------------------------- |
| Default          | Base appearance                                                             |
| Hover            | `--bg-hover` or color shift using `-hover` token variant                    |
| Focus            | `--shadow-focus` ring, `--border-focus`                                     |
| Active / Pressed | `-pressed` token variant, slight scale or depth change                      |
| Disabled         | `--bg-disabled` + `--text-disabled`, `cursor: not-allowed`, non-interactive |
| Loading          | Skeleton or spinner; element must not be interactive during loading         |

---

## 11. UX Laws & Principles

### Hick's Law

Reduce the number of choices presented at once. For multi-step flows (like RFP processing), show only the current step's options — do not surface all settings/actions simultaneously.

### Fitts's Law

Primary CTAs must be large enough and placed where the user's cursor naturally lands. Avoid placing the most-used action in a corner or at the far edge of a long form.

### Miller's Law

Group related information into chunks of 5–9 items. Long lists (e.g. RFP sections, feature lists) must be grouped by category with clear section headers.

### Jakob's Law

Follow established patterns for common UI: tables with column headers for data lists, step indicators for multi-step flows, breadcrumbs for deep navigation. Users expect familiar patterns — innovate on content, not convention.

### Proximity principle (Gestalt)

Related elements must be visually close. Section labels must be closer to their content than to adjacent sections. Form fields and their labels must be tightly paired.

### Feedback principle

Every user action must produce visible feedback within 100ms (even if processing takes longer). Use loading states, skeleton screens, or progress indicators — never leave the user in a silent wait.

### Progressive disclosure

Show the minimum required information first. Surface detail on demand (expand, drawer, tooltip). This is especially important in the RFP analysis and scope creation steps where content volume is high.

### Error prevention over error recovery

Prefer disabling actions that would cause errors (e.g. "Next" when required fields are empty) over showing error messages after submission. When errors must be shown, be specific and actionable.

---

## 12. Multi-Step Flow Rules (RFP Processing)

The core RFP workflow is a sequential multi-step process. These rules apply to all step screens:

- Always show a persistent step indicator (current step / total steps) at the top
- "Back" must always be available and must not lose unsaved work
- Auto-save or warn before leaving a step with unsaved changes
- Each step must have one primary CTA (green) and one secondary action (Back / Cancel)
- Do not allow proceeding to the next step until the current step's required inputs are valid
- AI-processing states (when agent is running) must show a visible progress indicator with a descriptive label of what is being processed — never a generic spinner
- Regenerate actions must be scoped to the section being regenerated — do not re-run the entire flow

---

## 13. Data Tables & Lists

- Tables must have fixed, labelled column headers
- Columns must be sortable where data type supports it (text, date, status)
- Empty states must always have: an icon/illustration, a headline, a description, and a CTA if applicable
- Rows must have a hover state (`--bg-hover`)
- Selected rows use `--bg-selected`
- Status columns use status badge components with `--status-*` tokens — never raw text
- Truncate long text with ellipsis and expose full content on hover via tooltip

---

## 14. Forms & Inputs

- Every input must have a visible label — placeholder text is not a label
- Labels are positioned above inputs (not inline or floating)
- Required fields must be marked (asterisk with a legend, not just red text)
- Validation runs on blur (not on keystroke) for text fields
- Error messages appear directly below the relevant field, using `--status-error-text` and `--status-error-icon`
- Success confirmation appears inline after successful async action
- Inputs must not resize or reflow on error — reserve space for error messages

---

## 15. Responsive & Layout

- Base layout is desktop-first (this is a professional B2B tool; mobile is not P0)
- Minimum supported viewport width: 1280px
- Use CSS Grid for page-level layout, Flexbox for component-level layout
- Sidebar is fixed-width; main content area is fluid
- Modals and drawers must not exceed 80vh height; internal content scrolls, not the modal chrome
- Z-index layers must use the defined scale: `--z-dropdown` (100) → `--z-sticky` (200) → `--z-overlay` (300) → `--z-modal` (400) → `--z-toast` (500) → `--z-tooltip` (600)

---

## 16. Iconography & Imagery

- Use a single icon library consistently throughout — do not mix icon sets
- Icons used alongside text must be the same visual weight as the text
- Standalone icons (no label) must always have an `aria-label` or `title`
- Icon size must align to the type scale: 16px with `--text-sm`, 20px with `--text-base`, 24px with `--text-lg`
- No decorative images in the core RFP flow — keep the interface clean and information-dense

---

## 17. Accessibility Checklist (per component / screen)

Before shipping any screen, verify:

- [ ] All text passes WCAG AA contrast (4.5:1 normal, 3:1 large)
- [ ] No text is conveyed by color alone — always pair with icon or label
- [ ] All interactive elements have focus states
- [ ] Tab order follows visual order
- [ ] All form inputs have associated `<label>` elements
- [ ] All images have `alt` text; decorative images have `alt=""`
- [ ] Modals trap focus while open and return focus on close
- [ ] Error messages are announced to screen readers (use `role="alert"` or `aria-live`)
- [ ] Loading states are announced (`aria-busy`, `aria-live`)
- [ ] No content flashes more than 3 times per second (seizure risk)
- [ ] Touch targets are minimum 44×44px (for any future mobile consideration)
