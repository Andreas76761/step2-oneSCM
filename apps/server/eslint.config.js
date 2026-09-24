// Fokus auf Korrektheit asynchroner Datenbankzugriffe: jede Promise muss abgewartet werden.
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**'] },
  {
    files: ['src/**/*.ts', 'scripts/**/*.ts', 'test/**/*.ts'],
    languageOptions: { parser: tseslint.parser, parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'off',
    },
  },
);
