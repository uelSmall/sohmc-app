import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default [
	// Respect .gitignore
	includeIgnoreFile(gitignorePath),

	// Base JS rules
	js.configs.recommended,

	// TypeScript recommended rules
	...ts.configs.recommended,

	// Svelte recommended rules
	...svelte.configs.recommended,

	// Global language options + custom rules
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			// Disable no-undef for TS projects
			'no-undef': 'off'
		}
	},

	// Svelte-specific overrides
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	}
];
