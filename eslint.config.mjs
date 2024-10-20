import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin, { flatConfigs } from 'eslint-plugin-import';
import typescript from 'eslint-plugin-import/config/typescript';
import { build, files } from '$service-worker';
import { json } from '@sveltejs/kit';
import { env } from 'bun';

/** @type {import('eslint').Linter.Config} */
export default [
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	importPlugin.flatConfigs.typescript,
	{
		rules: {
			'no-unused-vars': 'off',
			'import/no-dynamic-require': 'warn',
			'import/no-nodejs-modules': 'warn',

			'prefer-arrow-callback': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],
			'import/order': [
				'warn',
				{
					groups: [['builtin', 'external', 'parent', 'sibling', 'index']],
					'newlines-between': 'always',
					pathGroups: [
						{
							pattern: '$features/**',
							group: 'external',
						},
						{
							pattern: '$lib/**',
							group: 'external',
						},
					],
				},
			],
		},
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				'import/no-dynamic-require': 'warn',
				'import/no-nodejs-modules': 'warn',
			},
		},
	},
	{
		ignores: [
			'build/',
			'.svelte-kit/',
			'dist/',
			'**/.DS_Store',
			'**/node_modules',
			'**/build',
			'**/package',
			'**/.env',
			'**/.env.*',
			'!**/.env.example',
		],
	},
];
