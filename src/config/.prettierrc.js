module.exports = {
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: false,
  jsxSingleQuote: false,
  printWidth: 80,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  semi: false,
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
