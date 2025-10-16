# Tailwind PostCSS Spacing

PostCSS plugin that converts `px`/`rem` values to `calc(var(--spacing) * n)` expressions. Perfect for scalable design systems.

## Features

- 🔄 Converts `px`/`rem` to `calc(var(--spacing) * n)`
- 🎯 Configurable base unit (default: 4px)
- 🛡️ Preserves hairline borders (≤1px)
- 📐 Handles multiple values
- ⚙️ Property filtering support

## Installation

```bash
npm install tailwind-postcss-spacing --save-dev
```

## Usage

```javascript
// postcss.config.js
import tailwindPostcssSpacing from 'tailwind-postcss-spacing'

export default {
  plugins: [tailwindPostcssSpacing()]
}
```

## Example

**Input:**

```css
.component {
  margin: 16px;
  padding: 8px 12px;
}
```

**Output:**

```css
.component {
  margin: calc(var(--spacing) * 4);
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
}
```

**Required CSS:**

```css
:root {
  --spacing: 4px; /* Base unit */
}
```

## Options

```javascript
// postcss.config.js
import tailwindPostcssSpacing from 'tailwind-postcss-spacing'

export default {
  plugins: [
    tailwindPostcssSpacing({
      base: 4,                    // Base unit (default: 4px)
      varName: '--spacing',       // CSS variable name
      preserveHairline: true,     // Keep borders ≤1px unchanged
      ignoreProperties: []        // Properties to ignore
    })
  ]
}
```

## License

MIT
