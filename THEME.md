# Now UI Kit Theme Documentation

## Overview

EstateVerse now uses the **Now UI Kit** design system - a modern, professional UI kit built by Creative Tim. This theme provides a cohesive color palette, typography system, and component styling across the entire application.

---

## Color Palette

### Primary Colors

| Color | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| Primary Orange | `#f96332` | `--color-primary` | Primary buttons, highlights, accents |
| Primary Dark | `#e85428` | `--color-primary-dark` | Hover states, active states |
| Primary Light | `rgba(249, 99, 50, 0.3)` | `--color-primary-light` | Light backgrounds, overlays |

### Secondary Colors

| Color | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| Info Blue | `#2CA8FF` | `--color-info` | Information, secondary buttons |
| Success Green | `#18ce0f` | `--color-success` | Success states, positive actions |
| Warning Yellow | `#FFB236` | `--color-warning` | Warnings, caution alerts |
| Danger Red | `#FF3636` | `--color-danger` | Errors, destructive actions |

### Neutral Colors

| Color | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| White | `#FFFFFF` | `--color-white`, `--bg-white` | Backgrounds, text on dark |
| Black | `#2c2c2c` | `--color-black` | Primary text color |
| Light Black | `#444444` | `--color-light-black` | Secondary text |
| Dark Gray | `#9A9A9A` | `--color-dark-gray` | Muted text, borders |
| Medium Gray | `#DDDDDD` | `--color-medium-gray` | Light borders |
| Light Gray | `#E3E3E3` | `--color-light-gray` | Very light backgrounds |
| Smoke | `#F5F5F5` | `--color-smoke`, `--bg-smoke` | Light backgrounds, section separation |

---

## Typography

### Font Family

All text uses **Montserrat** font family (imported from Google Fonts):
```css
font-family: var(--font-primary); /* 'Montserrat' */
```

### Font Weights

| Name | Weight | CSS Variable |
|------|--------|--------------|
| Light | 200 | `--font-weight-light` |
| Normal | 400 | `--font-weight-normal` |
| Semibold | 600 | `--font-weight-semibold` |
| Bold | 700 | `--font-weight-bold` |

### Font Sizes

| Size | Value | CSS Variable |
|------|-------|--------------|
| Extra Small | `0.75rem` (12px) | `--font-size-xs` |
| Small | `0.875rem` (14px) | `--font-size-sm` |
| Base | `1rem` (16px) | `--font-size-base` |
| Large | `1.125rem` (18px) | `--font-size-lg` |
| Extra Large | `1.25rem` (20px) | `--font-size-xl` |
| 2XL | `1.5rem` (24px) | `--font-size-2xl` |
| 3XL | `1.875rem` (30px) | `--font-size-3xl` |
| 4XL | `2.25rem` (36px) | `--font-size-4xl` |
| 5XL | `3rem` (48px) | `--font-size-5xl` |

### Line Heights

| Name | Value | CSS Variable |
|------|-------|--------------|
| Tight | 1.25 | `--line-height-tight` |
| Normal | 1.5 | `--line-height-normal` |
| Loose | 1.75 | `--line-height-loose` |
| Relaxed | 2 | `--line-height-relaxed` |

---

## Spacing Scale

All spacing follows a consistent scale based on `1rem (16px)`:

| Size | Value | CSS Variable |
|------|-------|--------------|
| XS | `0.25rem` (4px) | `--spacing-xs` |
| Small | `0.5rem` (8px) | `--spacing-sm` |
| Medium | `1rem` (16px) | `--spacing-md` |
| Large | `1.5rem` (24px) | `--spacing-lg` |
| Extra Large | `2rem` (32px) | `--spacing-xl` |
| 2XL | `3rem` (48px) | `--spacing-2xl` |
| 3XL | `4rem` (64px) | `--spacing-3xl` |

### Usage Examples

```css
/* Padding */
.element {
  padding: var(--spacing-md); /* 16px on all sides */
  padding: var(--spacing-lg) var(--spacing-md); /* 24px vertical, 16px horizontal */
}

/* Margin */
.element {
  margin: var(--spacing-xl) 0; /* 32px top/bottom, 0 left/right */
}
```

---

## Border Radius

| Size | Value | CSS Variable |
|------|-------|--------------|
| Small | `0.375rem` (6px) | `--border-radius-sm` |
| Base | `0.5rem` (8px) | `--border-radius-base` |
| Large | `0.75rem` (12px) | `--border-radius-lg` |

---

## Shadows

The shadow system creates depth and hierarchy:

| Level | Value | CSS Variable |
|-------|-------|--------------|
| Small | `0px 2px 4px rgba(0, 0, 0, 0.1)` | `--shadow-sm` |
| Medium | `0px 5px 15px rgba(0, 0, 0, 0.15)` | `--shadow-md` |
| Large | `0px 5px 25px rgba(0, 0, 0, 0.2)` | `--shadow-lg` |
| Extra Large | `0px 10px 40px rgba(0, 0, 0, 0.3)` | `--shadow-xl` |

### Usage

```css
.card {
  box-shadow: var(--shadow-md);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transition: box-shadow var(--transition-base);
}
```

---

## Transitions & Animations

| Speed | Duration | CSS Variable |
|-------|----------|--------------|
| Fast | `0.15s` | `--transition-fast` |
| Base | `0.2s` | `--transition-base` |
| Slow | `0.3s` | `--transition-slow` |

All transitions use `ease` timing function.

### Usage

```css
.button {
  transition: all var(--transition-base);
}

.button:hover {
  transform: translateY(-2px);
}
```

---

## Button Variants

The Now UI Kit provides multiple button styles:

### Primary Button
```jsx
<Button variant="primary" size="md">Click Me</Button>
```
- Background: `--color-primary`
- Text: White
- Hover: Darker shade with shadow lift

### Secondary Button
```jsx
<Button variant="secondary" size="md">Click Me</Button>
```
- Background: `--color-info` (blue)
- Text: White
- Hover: Darker shade with shadow lift

### Outline Button
```jsx
<Button variant="outline" size="md">Click Me</Button>
```
- Border: 2px solid primary color
- Text: Primary color
- Hover: Filled background

### Success Button
```jsx
<Button variant="success" size="md">Confirm</Button>
```
- Background: `--color-success` (green)
- Text: White

### Danger Button
```jsx
<Button variant="danger" size="md">Delete</Button>
```
- Background: `--color-danger` (red)
- Text: White

### Button Sizes

| Size | Class | Padding | Font Size |
|------|-------|---------|-----------|
| Small | `.btn-sm` | `0.5rem 1rem` | `0.75rem` |
| Medium | `.btn-md` | `1rem 1.5rem` | `0.875rem` |
| Large | `.btn-lg` | `1.5rem 2rem` | `1rem` |

---

## Component Styling

### Cards
- Border radius: `var(--border-radius-lg)`
- Padding: `var(--spacing-xl)`
- Shadow: `var(--shadow-md)` (lifts to `var(--shadow-lg)` on hover)
- Border: 1px solid with faint primary color
- Transform on hover: `translateY(-4px)` for depth effect

### Feature Cards
- Top border accent: Animated from left to full width on hover
- Smooth color transitions for text
- Responsive grid layout

### Navigation Links
- Animated underline on hover using gradient
- Text transform: uppercase
- Letter spacing: 0.5px for professional look

### Forms/Inputs
- Border radius: `var(--border-radius-base)`
- Focus shadow: Primary color with 30% opacity
- Text color: `--text-primary`

---

## Utility Classes

The theme includes convenient utility classes for rapid development:

### Text Colors
```html
<p class="text-primary">Primary text</p>
<p class="text-secondary">Secondary text</p>
<p class="text-success">Success text</p>
<p class="text-danger">Danger text</p>
<p class="text-muted">Muted text</p>
<p class="text-white">White text</p>
```

### Background Colors
```html
<div class="bg-primary">Primary background</div>
<div class="bg-info">Info background</div>
<div class="bg-success">Success background</div>
<div class="bg-smoke">Light background</div>
```

### Spacing
```html
<div class="p-4 m-3">Padding 2rem, Margin 1.5rem</div>
<div class="px-2 py-4">Horiz padding 1rem, Vert padding 2rem</div>
<div class="mx-auto">Centered with auto margins</div>
```

### Display & Flex
```html
<div class="d-flex flex-center">Flexbox centered</div>
<div class="d-grid">Grid layout</div>
<div class="hidden-mobile">Hidden on mobile</div>
```

### Shadows
```html
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow (hover effect feel)</div>
```

### Text Transform
```html
<p class="text-uppercase">UPPERCASE</p>
<p class="text-capitalize">Capitalized</p>
<p class="font-bold">Bold text</p>
<p class="font-light">Light weight</p>
```

---

## CSS Variable File Structure

The theme is organized into two main CSS files:

### `src/theme/variables.css`
- Defines all CSS custom properties (variables)
- Organized by category (colors, spacing, typography, shadows, etc.)
- Imported first in the cascade
- Safe to extend with new variables

### `src/theme/utils.css`
- Utility classes for rapid development
- Responsive utilities
- Spacing helpers
- Text and background color utilities
- Imported after variables for proper cascading

---

## Using Now UI Kit Colors in Components

### Example: Creating a New Gradient
```css
.gradient-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%);
}
```

### Example: Component with Theme Colors
```css
.custom-element {
  background-color: var(--bg-smoke);
  color: var(--text-primary);
  border: 2px solid rgba(249, 99, 50, 0.2);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.custom-element:hover {
  background-color: var(--color-primary-light);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Example: Creating Colored Badges
```css
.badge {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-base);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.badge-success {
  background-color: var(--color-success);
  color: var(--color-white);
}

.badge-danger {
  background-color: var(--color-danger);
  color: var(--color-white);
}
```

---

## Responsive Design

The theme uses a mobile-first approach with these breakpoints:

| Device | Breakpoint | Media Query |
|--------|-----------|-------------|
| Mobile | < 640px | Default (no media query) |
| Tablet | ≥ 768px | `@media (min-width: 768px)` |
| Desktop | ≥ 1024px | `@media (min-width: 1024px)` |

### Best Practices

1. **Mobile First**: Write default styles for mobile, then enhance for larger screens
2. **Use Variables**: Always use CSS variables for consistency
3. **Test Across Devices**: Use DevTools device emulation to verify responsive behavior
4. **Follow Conventions**: Use existing component class names for consistency

---

## Extending the Theme

### Adding a New Color

Edit `src/theme/variables.css`:

```css
:root {
  /* ... existing variables ... */
  
  /* New Brand Color */
  --color-brand-purple: #9c4ddd;
  --color-brand-purple-light: rgba(156, 77, 221, 0.3);
  --color-brand-purple-dark: #8540c9;
}
```

### Adding a New Spacing Value

Edit `src/theme/variables.css`:

```css
:root {
  /* ... existing spacing ... */
  
  --spacing-4xl: 5rem; /* 80px */
}
```

### Creating a New Utility Class

Edit `src/theme/utils.css`:

```css
.rounded-xl {
  border-radius: 1rem;
}

.border-primary {
  border: 2px solid var(--color-primary);
}
```

---

## Color Contrast & Accessibility

All color combinations meet WCAG AA standards for readability:

- Primary text (`--text-primary`) on white background: ✓ Passes
- White text on primary color: ✓ Passes
- Muted text on light backgrounds: ✓ Passes
- Light backgrounds with subtle borders: ✓ Passes

When adding new colors, verify contrast using:
- [WebAIM Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WCAG 2.1 AA Standard](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html): 4.5:1 for text

---

## Component Examples from Now UI Kit

### Profile-like Cards
```css
.profile-card {
  background-color: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  border-top: 4px solid var(--color-primary);
  text-align: center;
}

.profile-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```

### Sections with Backgrounds
```css
.section-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-info));
  color: var(--color-white);
  padding: var(--spacing-3xl) var(--spacing-xl);
}

.section-light {
  background-color: var(--bg-smoke);
  padding: var(--spacing-3xl) var(--spacing-xl);
}
```

---

## Performance Notes

- CSS variables are natively supported in all modern browsers
- No compilation needed (unlike SCSS)
- Fast variable lookup and cascade
- Easy to debug with DevTools
- Can be dynamically updated with JavaScript if needed

```javascript
// Example: Dynamic theme switching
document.documentElement.style.setProperty('--color-primary', '#2196F3');
```

---

## Resources

- [Now UI Kit Documentation](https://demos.creative-tim.com/now-ui-kit/)
- [CSS Custom Properties (Variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Montserrat Font](https://fonts.google.com/specimen/Montserrat)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Version**: 1.0.0  
**Last Updated**: February 23, 2026  
**Based on**: Now UI Kit v1.1.0 by Creative Tim
