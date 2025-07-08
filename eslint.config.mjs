import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['plugin:@next/next/recommended', 'next/core-web-vitals', 'next/typescript'],
    rules: {
      // Disable unescaped entities rule - apostrophes in content are fine
      'react/no-unescaped-entities': 'off',
      // Allow unused vars that start with underscore (common for required but unused parameters)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  }),
]

export default eslintConfig
