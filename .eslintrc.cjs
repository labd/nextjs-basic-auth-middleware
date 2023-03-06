module.exports = {
  root: true,
  extends: ['@labdigital/eslint-config-node'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.cjs'],
  },
}
