/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier',
		'plugin:import/recommended',
		'plugin:import/svelte',
		'plugin:import/typescript',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	rules: {
		'prefer-arrow-callback': 'warn',
		'import/order': [
			'builtin',
			'external',
			'internal',
			'parent',
			'sibling',
			'index',
			'object',
			'type',
		],
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
				'import/no-dynamic-require': 'warn',
      	'import/no-nodejs-modules': 'warn',
			},
		},
	],
};
