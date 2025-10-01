# diskette/colors

Radix UI colors for Tailwind CSS v4. This package generates all of Radix UI color scales as JavaScript exports and CSS custom properties formatted for Tailwind CSS's `@theme` directive.

## Installation

```bash
# npm
npm install @diskette/colors

# pnpm
pnpm add @diskette/colors
```

## Usage

### Tailwind Usage

Import pre-built CSS files with Tailwind CSS custom properties:

```css
@import 'tailwindcss';

@theme {
  /* Optionally disable all of tailwindcss colors */
  --color-*: initial;
}

/* Standard colors */
@import '@diskette/colors/amber.css';
@import '@diskette/colors/amber-dark.css';

@import '@diskette/colors/gray.css';
@import '@diskette/colors/gray-dark.css';

/* Alpha variants */
@import '@diskette/colors/amber-alpha.css';
@import '@diskette/colors/amber-dark-alpha.css';

@import '@diskette/colors/gray-alpha.css';
@import '@diskette/colors/gray-dark-alpha.css';

/* display-p3 colors */
@import '@diskette/colors/p3/amber.css';
@import '@diskette/colors/p3/amber-dark.css';

@import '@diskette/colors/p3/gray.css';
@import '@diskette/colors/p3/gray-dark.css';
```

Each CSS file contains color variables using Tailwind CSS v4's @theme directive:

```css
@theme {
  --color-gray-1: #fcfcfc;
  --color-gray-2: #f9f9f9;
  /* ... up to gray-12 */
}
```

For display-p3 colors:

```css
@theme {
  --color-amber-a1: color(display-p3 0.992 0.298 0 / 0.017);
  --color-amber-a2: color(display-p3 0.988 0.651 0 / 0.047);
  --color-amber-a3: color(display-p3 1 0.6 0 / 0.118);
  /* ... up to amber-a12 */
}
```

### JavaScript/TypeScript

Import color objects directly in your JavaScript or TypeScript code:

```js
import { gray, grayA, grayDark } from '@diskette/colors'

// Access individual color values
console.log(gray.gray1) // '#fcfcfc'
console.log(gray.gray12) // '#202020'
```
