import resolve from '@rollup/plugin-node-resolve'

export default [
	// ES Module build
	{
		input: 'index.js',
		external: ['postcss-value-parser'],
		output: {
			file: 'dist/index.mjs',
			format: 'esm',
			exports: 'default'
		},
		plugins: [resolve()]
	},
	// CommonJS build
	{
		input: 'index.js',
		external: ['postcss-value-parser'],
		output: {
			file: 'dist/index.cjs',
			format: 'cjs',
			exports: 'default'
		},
		plugins: [resolve()]
	},
	// UMD build for browser
	{
		input: 'index.js',
		external: ['postcss-value-parser'],
		output: {
			file: 'dist/index.umd.js',
			format: 'umd',
			name: 'tailwindPostcssSpacing',
			exports: 'default',
			globals: {
				'postcss-value-parser': 'valueParser'
			}
		},
		plugins: [resolve()]
	}
]
