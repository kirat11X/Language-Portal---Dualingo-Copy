# Design System Strategy: The Luminous Scholar

## 1. Overview & Creative North Star
The North Star for this design system is **"The Luminous Scholar."** 

We are moving away from the rigid, boxed-in nature of traditional SaaS and towards an editorial, "floating" experience. By blending the playful gamification of Duolingo with the structured utility of Notion and the precision of Linear, we create a space that feels both academic and ethereal. 

The system rejects the "grid-of-boxes" trope. Instead, we use **Intentional Asymmetry** and **Tonal Depth** to guide the eye. Imagine the UI as a series of translucent, high-quality vellum sheets layered over a soft, ambient light source. This approach mirrors the journey of language learning: moving from the opaque unknown to crystalline clarity.

---

## 2. Colors & Surface Philosophy
Color in this system is not just decorative; it is structural. We use a "Light-In-Motion" approach where the primary purple (#702ae1) acts as the heartbeat of the interface.

### The "No-Line" Rule
**Explicit Instruction:** Use of 1px solid borders for sectioning is strictly prohibited. 
- Boundaries must be defined through background color shifts. 
- For example, a `surface-container-low` (#eff1f3) sidebar sitting against a `surface` (#f5f6f8) main content area.
- Interaction and separation are achieved through contrast in *value*, not through lines.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack.
- **Base Layer:** `surface` (#f5f6f8)
- **Secondary Sections:** `surface-container-low` (#eff1f3)
- **Interactive Cards:** `surface-container-lowest` (#ffffff) to provide a "pop" of clean white.
- **Nesting:** When placing a study card inside a dashboard section, the section should be `surface-container` (#e6e8eb) and the card `surface-container-lowest`. This creates a natural, tactile lift.

### Signature Textures: Glass & Gradient
To achieve the high-end editorial feel, use **Glassmorphism** for floating elements (like hover tooltips or mobile navigation).
- **Glass Token:** Use `surface-container-lowest` at 70% opacity with a `backdrop-blur` of 20px.
- **Gradients:** CTAs should use a subtle linear gradient from `primary` (#702ae1) to `primary-container` (#b28cff) at a 135° angle. This adds "soul" and prevents the UI from looking flat or "template-like."

---

## 3. Typography: The Editorial Voice
We utilize a dual-font system to balance character with readability.

- **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "tech-editorial" feel. Use `display-lg` (3.5rem) for high-impact moments like "Lesson Complete" screens. Use tight letter-spacing (-0.02em) for headlines to create a sophisticated, compact look.
- **Body & UI (Inter):** Chosen for its legendary legibility at small sizes. 
- **The Hierarchy Strategy:** Hierarchy is driven by scale and weight rather than just color. A `headline-lg` in `on-surface` (#2c2f31) paired with a `body-md` in `on-surface-variant` (#595c5e) creates a clear, authoritative path for the learner’s eye.

---

## 4. Elevation & Depth
In this design system, shadows are "Ambient Atmosphere," not "Drop Shadows."

- **The Layering Principle:** Avoid shadows for static layout elements. Reserve them for "active" objects. 
- **Ambient Shadows:** For floating activity cards, use a multi-layered shadow:
  - `box-shadow: 0 4px 20px -2px rgba(112, 42, 225, 0.04), 0 12px 40px -8px rgba(44, 47, 49, 0.08);`
  - The purple tint in the shadow mimics the way light reflects off the primary brand color.
- **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use `outline-variant` (#abadaf) at 15% opacity. It should be felt, not seen.

---

## 5. Components & Primitive Styling

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-container`), `xl` rounded corners (3rem), `on-primary` text. No border.
- **Secondary:** `surface-container-highest` background with `primary` text. Provides high contrast without the weight of the gradient.
- **Tertiary:** Pure text with `primary` color, switching to `surface-container-low` background on hover.

### Study Activity Cards
- **Construction:** `surface-container-lowest` background, `xl` (3rem) corner radius.
- **Layout:** Asymmetric padding. Use `spacing-8` (2.75rem) on the top/left and `spacing-6` (2rem) on the bottom/right to create a custom, "boutique" feel.
- **Interaction:** On hover, the card should lift using an Ambient Shadow and scale by 1.02x.

### Data Tables (The "Notion" Evolution)
- **Forbid Dividers:** Do not use horizontal lines between rows.
- **Alternating Tones:** Use `surface-container-low` for the header row and white for the body. 
- **Spacing:** Use `spacing-4` (1.4rem) for vertical cell padding to give the data "room to breathe."

### Sidebar Navigation
- **Styling:** `surface-container-low` background. 
- **Active State:** Instead of a highlight bar, use a "cut-out" effect: the active item becomes `surface-container-lowest` (white) with an `xl` corner radius, creating a "pill" that appears to be inset into the sidebar.

---

## 6. Do’s and Don’ts

### Do
- **Do use whitespace as a separator.** Use the `spacing-12` (4rem) token to divide major dashboard sections.
- **Do use "Surface Tinting."** When an error occurs, don't just use a red border; tint the entire container background with a 5% opacity of `error` (#b41340).
- **Do prioritize the Punjabi script.** Ensure the line-height for `body-lg` is increased to `1.6` to accommodate the unique descenders and accents of the Gurmukhi script.

### Don’t
- **Don’t use "Default" Shadows.** Never use `rgba(0,0,0,0.5)`. Shadows must always be tinted and diffused.
- **Don’t use 100% Black.** Use `on-background` (#2c2f31) for all "black" text to maintain the soft, premium feel.
- **Don’t cram components.** If a dashboard feels crowded, increase the corner radius and the padding. This system relies on "The Luxury of Space."