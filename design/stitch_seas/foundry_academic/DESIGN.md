# Design System Document: Engineering Excellence & Academic Rigor

## 1. Overview & Creative North Star: "The Architectural Blueprint"

This design system is built for the School of Engineering and Applied Sciences (SEAS). It rejects the clutter of traditional academic portals in favor of **The Architectural Blueprint**—a creative north star that prioritizes structural integrity, technical precision, and editorial clarity.

The system moves beyond "standard UI" by treating the digital interface as a high-end physical environment. We achieve this through **Intentional Asymmetry** (using whitespace as a functional element), **Tonal Layering** (replacing lines with light), and **Authoritative Typography** (using high-contrast scales to lead the eye). The result is an interface that feels as robust and reliable as the engineering principles it represents, providing a calm, focused environment for high-stakes examinations.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule

The color palette is anchored in `primary` (#00193c), evoking a sense of deep-seated institutional trust, complemented by `secondary` (#046d40) for precision-driven actions.

### The "No-Line" Rule
To maintain a premium, editorial feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined solely through:
*   **Background Shifts:** Transitioning from `surface` (#f8f9fb) to `surface-container-low` (#f2f4f6).
*   **Tonal Transitions:** Defining the edge of a workspace by moving from `surface-container-highest` to a `surface-container-lowest` card.

### Surface Hierarchy & Nesting
Treat the UI as a series of nested, physical layers. 
*   **Level 0 (Foundation):** `surface` or `background` for the primary canvas.
*   **Level 1 (Sectioning):** `surface-container-low` for sidebars or secondary content areas.
*   **Level 2 (Interaction):** `surface-container-lowest` (#ffffff) for primary content cards or exam questions, creating a "lifted" paper effect.

### The "Glass & Gradient" Rule
For high-stakes overlays or persistent navigation, utilize **Glassmorphism**. Apply `surface_variant` at 80% opacity with a `backdrop-blur: 12px`. For main CTAs and Hero headers, use a subtle linear gradient from `primary` (#00193c) to `primary_container` (#002d62) at a 135-degree angle to add "visual soul" and dimension.

---

## 3. Typography: The Technical Editorial

The typography pairs **Manrope** (Display/Headlines) for a modern, geometric engineering feel with **Inter** (Body/Labels) for maximum legibility during intense reading tasks.

*   **Display & Headline (Manrope):** These are your "Anchors." Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for landing pages. Use `headline-sm` (1.5rem) for exam section titles to convey authority.
*   **Body & Title (Inter):** The "Workhorse." `body-lg` (1rem) is the standard for exam questions to ensure no eye strain. Use `title-md` (1.125rem) for sub-headers within technical documentation.
*   **Labels (Inter):** Set in `label-md` (0.75rem), often paired with `on_surface_variant` to distinguish metadata from primary content.

---

## 4. Elevation & Depth: Tonal Layering

In this system, depth is a functional tool, not a decoration. We avoid heavy shadows in favor of light-based separation.

*   **The Layering Principle:** Rather than drawing a box, place a `surface-container-lowest` card on top of a `surface-container-low` background. The subtle shift from `#ffffff` to `#f2f4f6` creates a sophisticated, "borderless" containment.
*   **Ambient Shadows:** Use only when an element is "floating" (e.g., a modal or a floating action button). 
    *   *Spec:* `0px 8px 24px rgba(25, 28, 30, 0.06)`. The shadow color is a tinted version of `on-surface`, ensuring it feels like a natural light obstruction rather than a gray smudge.
*   **The Ghost Border Fallback:** If accessibility requirements demand a container edge, use a "Ghost Border": `outline-variant` (#c4c6d1) at **15% opacity**.
*   **Glassmorphism:** Use semi-transparent `primary` or `surface` containers for floating status bars. This keeps the user grounded in the "total environment" of the exam while providing a clear focus area.

---

## 5. Components: Precision Engineered

### Buttons (The Action Anchors)
*   **Primary:** A solid `primary` (#00193c) fill with `on_primary` text. Radius: `md` (0.375rem). For critical "Submit" actions, use a `secondary` (#046d40) gradient to `on_secondary_container` to signal success.
*   **Tertiary:** No background, `primary` text. Used for "Cancel" or "Go Back" to minimize visual noise.

### Input Fields (The Data Collectors)
*   **Visual Style:** Avoid full-box outlines. Use a `surface-container-high` background with a 2px `primary` bottom-border that activates on focus. 
*   **Error State:** Use `error` (#ba1a1a) text for helper messages, with the input container shifting to `error_container`.

### Examination Cards
*   **Constraint:** Forbid the use of divider lines. 
*   **Execution:** Separate the question text from multiple-choice options using a 24px vertical spacing gap (from the spacing scale) and a subtle background shift to `surface-container-highest` for the active selection.

### Progress Trackers (Signature Component)
*   Use a "segmented glass" bar. Completed segments in `secondary` (#046d40), current segment in `primary`, and upcoming segments in `outline_variant` at 30% opacity.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts. For example, a 3-column grid where the main content spans 2 columns and the sidebar spans 1, but with generous, unequal gutters.
*   **Do** use `secondary` (Emerald) sparingly. It is a "Precision Tool" for success states and final confirmations only.
*   **Do** prioritize `body-lg` for all technical reading. Legibility is the highest form of accessibility in an engineering context.

### Don't:
*   **Don't** use 1px solid black or dark gray borders. It breaks the "Architectural Blueprint" feel.
*   **Don't** use standard "Drop Shadows." If it doesn't look like ambient light, it doesn't belong.
*   **Don't** crowd the interface. If a screen feels "busy," increase the `surface` whitespace rather than adding more containers.
*   **Don't** use pure black (#000000). Always use `on_surface` (#191c1e) for text to maintain a softer, premium contrast.