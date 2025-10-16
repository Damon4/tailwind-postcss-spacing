const postcss = require('postcss')

// Use dynamic import for ES module compatibility
let plugin

beforeAll(async () => {
	const module = await import('../index.js')
	plugin = module.default
})

// Helper function to run plugin
async function run(input, output, opts = {}) {
	const result = await postcss([plugin(opts)]).process(input, { from: undefined })
	expect(result.css).toEqual(output)
	expect(result.warnings()).toHaveLength(0)
}

describe('tailwind-postcss-spacing', () => {
	describe('basic px conversion', () => {
		it('converts px values to calc expressions', async () => {
			await run(
				'a { margin: 8px; }',
				'a { margin: calc(var(--spacing) * 2); }'
			)
		})

		it('converts with default base of 4px', async () => {
			await run(
				'a { padding: 16px; }',
				'a { padding: calc(var(--spacing) * 4); }'
			)
		})

		it('handles fractional values', async () => {
			await run(
				'a { margin: 6px; }',
				'a { margin: calc(var(--spacing) * 1.5); }'
			)
		})

		it('converts 0px to 0', async () => {
			await run(
				'a { margin: 0px; }',
				'a { margin: 0; }'
			)
		})
	})

	describe('rem conversion', () => {
		it('converts rem values to calc expressions', async () => {
			await run(
				'a { margin: 2rem; }',
				'a { margin: calc(var(--spacing) * 2); }'
			)
		})

		it('converts 0rem to 0', async () => {
			await run(
				'a { margin: 0rem; }',
				'a { margin: 0; }'
			)
		})

		it('handles fractional rem values', async () => {
			await run(
				'a { padding: 1.5rem; }',
				'a { padding: calc(var(--spacing) * 1.5); }'
			)
		})
	})

	describe('border handling', () => {
		it('preserves hairline borders by default', async () => {
			await run(
				'a { border-width: 1px; }',
				'a { border-width: 1px; }'
			)
		})

		it('converts larger border values', async () => {
			await run(
				'a { border-width: 4px; }',
				'a { border-width: calc(var(--spacing) * 1); }'
			)
		})

		it('can disable hairline preservation', async () => {
			await run(
				'a { border-width: 1px; }',
				'a { border-width: calc(var(--spacing) * 0.25); }',
				{ preserveHairline: false }
			)
		})
	})

	describe('custom properties (CSS variables)', () => {
		it('converts px in custom properties', async () => {
			await run(
				':root { --my-spacing: 16px; }',
				':root { --my-spacing: calc(var(--spacing) * 4); }'
			)
		})

		it('does not convert the --spacing variable itself', async () => {
			await run(
				':root { --spacing: 4px; }',
				':root { --spacing: 4px; }'
			)
		})
	})

	describe('multiple values', () => {
		it('handles multiple space-separated values', async () => {
			await run(
				'a { margin: 8px 16px; }',
				'a { margin: calc(var(--spacing) * 2) calc(var(--spacing) * 4); }'
			)
		})

		it('handles four values', async () => {
			await run(
				'a { padding: 8px 16px 12px 4px; }',
				'a { padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4) calc(var(--spacing) * 3) calc(var(--spacing) * 1); }'
			)
		})

		it('handles mixed units', async () => {
			await run(
				'a { margin: 8px auto 16px; }',
				'a { margin: calc(var(--spacing) * 2) auto calc(var(--spacing) * 4); }'
			)
		})
	})

	describe('configuration options', () => {
		it('uses custom base value', async () => {
			await run(
				'a { margin: 16px; }',
				'a { margin: calc(var(--spacing) * 2); }',
				{ base: 8 }
			)
		})

		it('uses custom variable name', async () => {
			await run(
				'a { margin: 8px; }',
				'a { margin: calc(var(--my-unit) * 2); }',
				{ varName: '--my-unit' }
			)
		})

		it('ignores specified properties', async () => {
			await run(
				'a { margin: 8px; padding: 8px; }',
				'a { margin: 8px; padding: calc(var(--spacing) * 2); }',
				{ ignoreProperties: ['margin'] }
			)
		})

		it('ignores properties by regex', async () => {
			await run(
				'a { margin-top: 8px; margin-left: 8px; padding: 8px; }',
				'a { margin-top: 8px; margin-left: 8px; padding: calc(var(--spacing) * 2); }',
				{ ignoreProperties: [/^margin-/] }
			)
		})
	})

	describe('edge cases', () => {
		it('ignores values that are not plain numbers', async () => {
			await run(
				'a { margin: calc(8px + 4px); }',
				'a { margin: calc(calc(var(--spacing) * 2) + calc(var(--spacing) * 1)); }'
			)
		})

		it('ignores values without px or rem', async () => {
			await run(
				'a { margin: 8em; padding: 10%; width: auto; }',
				'a { margin: 8em; padding: 10%; width: auto; }'
			)
		})

		it('handles decimal precision correctly', async () => {
			await run(
				'a { margin: 5px; }',
				'a { margin: calc(var(--spacing) * 1.25); }'
			)
		})

		it('removes trailing zeros from decimals', async () => {
			await run(
				'a { margin: 6px; }',
				'a { margin: calc(var(--spacing) * 1.5); }' // not 1.5000
			)
		})
	})
})