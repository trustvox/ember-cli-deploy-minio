module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: ['node'],
  env: {
    browser: true
  },
  overrides: [
    {
      files: [
        'index.js',
        'tests/**/*.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      globals: {
        describe: true,
        before: true,
        beforeEach: true,
        it: true
      },
      env: {
        browser: false,
        node: true
      },
    }
  ]
};
