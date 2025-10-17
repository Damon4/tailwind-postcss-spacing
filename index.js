// PostCSS plugin to transform `Npx` and `Nrem` into calc with CSS variables
// Example: margin: 8px -> margin: calc(var(--spacing) * 2) when base is 4px
// Example: margin: 2rem -> margin: calc(var(--spacing) * 8) when base is 4px and remBase is 16px
// It keeps 0px/0rem as 0 and leaves values with css vars or functions untouched except plain pixel/rem numbers.

import valueParser from 'postcss-value-parser'

const BASE = 4 // 1 unit == 4px
const REM_BASE = 16 // 1rem = 16px by default

export default function tailwindPostcssSpacing(options = {}) {
	const base = Number(options.base ?? BASE)
	const remBase = Number(options.remBase ?? REM_BASE)
	const varName = String(options.varName ?? '--spacing')
	const preserveHairline = options.preserveHairline !== false // default true
	const ignoreProps = Array.isArray(options.ignoreProperties) ? options.ignoreProperties : []

	const isBorderProp = (prop) =>
		/^(border($|-)|border-(top|right|bottom|left)(-|$)|border-width$)/.test(prop)
	const shouldIgnoreProp = (prop) =>
		ignoreProps.some((p) => {
			if (typeof p === 'string') return p === prop
			if (p && p instanceof RegExp) return p.test(prop)
			return false
		})

	return {
		postcssPlugin: 'tailwind-postcss-spacing',
		Declaration(decl) {
			// Process regular declarations and custom properties (starting with --)
			if (!decl.value || (decl.value.indexOf('px') === -1 && decl.value.indexOf('rem') === -1))
				return
			const prop = decl.prop || ''
			// Ignore the --spacing variable itself
			if (prop === '--spacing') return
			// Don't ignore custom properties
			if (!prop.startsWith('--') && shouldIgnoreProp(prop)) return

			// Skip transform for border images/urls/gradients etc when not plain numbers
			const parsed = valueParser(decl.value)
			let changed = false

			parsed.walk((node) => {
				if (node.type !== 'word') return
				const hasPixels = node.value.endsWith('px')
				const hasRems = node.value.endsWith('rem')
				if (!hasPixels && !hasRems) return

				// Do not change 0px or 0rem
				if (node.value === '0px' || node.value === '0rem') {
					node.value = '0'
					changed = true
					return
				}

				if (hasPixels) {
					const numStr = node.value.slice(0, -2)
					const num = Number(numStr)
					if (!Number.isFinite(num)) return

					// Preserve hairline borders (<=1px) if enabled, but not for custom properties
					if (!prop.startsWith('--') && preserveHairline && isBorderProp(prop) && num <= 1) {
						return // keep as is (except 0px handled above)
					}

					const units = num / base
					// If divisible, keep integer; else keep up to 4 decimals
					const pretty = Number.isInteger(units)
						? String(units)
						: units.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')
					node.value = `calc(var(${varName}) * ${pretty})`
					changed = true
				} else if (hasRems) {
					const numStr = node.value.slice(0, -3)
					const num = Number(numStr)
					if (!Number.isFinite(num)) return

					// Convert rem to px equivalent, then divide by base
					// Example: 2rem with remBase=16 and base=4 → (2 * 16) / 4 = 8 units
					const pxValue = num * remBase
					const units = pxValue / base
					const pretty = Number.isInteger(units)
						? String(units)
						: units.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')
					node.value = `calc(var(${varName}) * ${pretty})`
					changed = true
				}
			})

			if (changed) {
				decl.value = parsed.toString()
			}
		},
	}
}
tailwindPostcssSpacing.postcss = true