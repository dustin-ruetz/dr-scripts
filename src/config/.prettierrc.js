/**
 * steps to enable code formatting on save of a file in Visual Studio Code (VS Code):
 *
 * 1. Press Cmd+, to open Settings
 * 2. Type "formatter" into the Settings searchbar
 * 3. Set the "Editor: Default Formatter" selector to "Prettier - Code formatter"
 * 4. Set the "Editor: Format On Save" checkbox to checked
 */
module.exports = {
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
  /**
   * currently @prettier/plugin-pug works with the `npm run format` script, but
   * the Prettier extension does not auto-format code on save of the file
   *
   * https://github.com/prettier/plugin-pug/
   */
  pugAttributeSeparator: 'as-needed',
  pugClassNotation: 'as-is',
  pugBracketSameLine: false,
  pugClassLocation: 'before-attributes',
  pugCommentPreserveSpaces: 'trim-all',
  pugExplicitDiv: true,
  pugIdNotation: 'as-is',
  pugSingleQuote: false,
  pugWrapAttributesThreshold: 1,
}
