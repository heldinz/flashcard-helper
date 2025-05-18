import js from '@eslint/js';
import markdown from '@eslint/markdown';
import { defineConfig } from 'eslint/config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default defineConfig([
	{
		files: ['**/*.js'],
		plugins: { js, 'simple-import-sort': simpleImportSort },
		extends: ['js/recommended'],
		rules: {
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						// Unassigned imports (side effects)
						['^\\u0000'],
						// Node.js builtins prefixed with `node:`
						['^node:'],
						// Third-party packages
						['^'],
						// Relative imports (anything starting with a dot)
						['^\\.'],
					],
				},
			],
		},
	},
	{
		files: ['public/app.js'],
		languageOptions: { globals: globals.browser },
	},
	{
		files: ['server.js'],
		languageOptions: { globals: globals.node },
	},
	{
		files: ['**/*.md'],
		plugins: { markdown },
		language: 'markdown/gfm',
		extends: ['markdown/recommended'],
	},
]);
