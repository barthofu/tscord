const antfu = require('@antfu/eslint-config').default
const pluginSimpleImportSort = require('eslint-plugin-simple-import-sort')

module.exports = antfu(
	{
		stylistic: {
			indent: 'tab',
			quotes: 'single',
			semi: false,

			// https://eslint.style/packages/ts
			overrides: {
				'curly': 'off',
				'style/block-spacing': ['error', 'always'],
				'style/brace-style': ['error', '1tbs'],
				'style/comma-dangle': ['error', {
					arrays: 'always-multiline',
					objects: 'always-multiline',
					imports: 'always-multiline',
					exports: 'always-multiline',
					functions: 'never',
				}],
				'style/comma-spacing': ['error', { before: false, after: true }],
				'style/func-call-spacing': ['error', 'never'],
				'style/lines-around-comment': ['error', {
					beforeBlockComment: true,
					afterBlockComment: false,
					beforeLineComment: false,
					afterLineComment: false,
					allowBlockStart: true,
					allowBlockEnd: true,
					allowObjectStart: true,
					allowObjectEnd: true,
					allowArrayStart: true,
					allowArrayEnd: true,
				}],
				'style/member-delimiter-style': ['error', {
					multiline: {
						delimiter: 'none',
						requireLast: true,
					},
					singleline: {
						delimiter: 'comma',
						requireLast: false,
					},
				}],
				'style/object-curly-spacing': ['error', 'always'],
				'style/padded-blocks': ['error', {
					blocks: 'never',
					classes: 'always',
					switches: 'never',
				}],
				'style/padding-line-between-statements': [
					'error',
					{ blankLine: 'always', prev: '*', next: 'class' },
					{ blankLine: 'always', prev: '*', next: 'block' },
					{ blankLine: 'always', prev: '*', next: 'return' },
					{ blankLine: 'always', prev: '*', next: 'case' },
					{ blankLine: 'always', prev: '*', next: 'default' },
				],
				'style/quote-props': ['error', 'consistent-as-needed'],

				// 'style/space-before-blocks': ['error', 'always'],
				'style/type-annotation-spacing': ['error', {
					before: false,
					after: true,
					overrides: {
						arrow: { before: true, after: true },
					},
				}],

			},
		},

		jsonc: false,
		yaml: false,

		linterOptions: {
			reportUnusedDisableDirectives: false,
		},

		ignores: [
			'node_modules',
			'build',
			'logs',
			'database',
		],
	},
	{
		plugins: {
			'simple-import-sort': pluginSimpleImportSort,
		},
		rules: {
			'ts/ban-ts-comment': 'off',
			'ts/consistent-type-imports': 'off',
			'eslint-comments/no-unlimited-disable': 'off',
			'eslint-comments/no-unused-disable': 'off',

			'no-unused-vars': 'off', // prefer unused-imports/no-unused-vars
			'unused-imports/no-unused-vars': 'warn',

			'no-console': 'off',

			// Preferred "simple-import-sort" over "import/order"
			// See: https://github.com/lydell/eslint-plugin-simple-import-sort#how-is-this-rule-different-from-importorder
			'sort-imports': 'off',
			'import/order': 'off',
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						// Side effect imports.
						['^\\u0000'],
						// Node.js builtins prefixed with `node:`.
						['^node:'],
						// Packages.
						// Things that start with a letter (or digit or underscore), or `@` followed by a letter.
						['^@?\\w'],
						// Internal packages.
						// Things that start with `@/`.
						['^@/\\w'],
						// Other imports
						['^\\w'],
						// TypeScript import assignments.
						['^\\u0001', '^\\u0002'],
					],
				},
			],
			'simple-import-sort/exports': 'off',
			'import/no-duplicates': 'error',
		},
	}
)
