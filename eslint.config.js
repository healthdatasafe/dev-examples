import globals from 'globals';
import neostandard from 'neostandard';

export default [
  { ignores: ['**/node_modules/**', '**/dist/**'] },
  ...neostandard({ semi: true }),
  {
    files: ['**/*.js'],
    languageOptions: { globals: { ...globals.browser } }
  }
];
