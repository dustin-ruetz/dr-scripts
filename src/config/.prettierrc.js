/**
 * To enable code formatting on save of a file in VS Code:
 *
 * 1. Press Cmd+, to open Settings.
 * 2. Type "formatter" into the Settings searchbar.
 * 3. Set the "Editor: Default Formatter" selector to "Prettier - Code formatter".
 * 4. Set the "Editor: Format On Save" checkbox to checked.
 */
module.exports = {
  // https://prettier.io/docs/en/options.html
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: false,
  jsxSingleQuote: false,
  printWidth: 80,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  semi: false,
  singleAttributePerLine: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  plugins: ['@prettier/plugin-pug'],
  // https://prettier.github.io/plugin-pug/guide/standard-prettier-overrides.html
  pugSingleQuote: false,
  // https://prettier.github.io/plugin-pug/guide/pug-specific-options.html
  pugAttributeSeparator: 'as-needed',
  pugClassLocation: 'before-attributes',
  pugClassNotation: 'as-is',
  pugCommentPreserveSpaces: 'trim-all',
  pugExplicitDiv: true,
  pugIdNotation: 'as-is',
  pugSortAttributes: 'asc',
  pugWrapAttributesThreshold: 1,
}
