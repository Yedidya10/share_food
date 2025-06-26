/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // 💡 חייב להיות האחרון
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    // 🔧 כללים נוספים שתרצה
    '@typescript-eslint/no-unused-vars': ['warn'],
    'prettier/prettier': ['error'],
  },
}
