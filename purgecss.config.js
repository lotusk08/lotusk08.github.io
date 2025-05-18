module.exports = {
  content: [
    './_site/**/*.html',
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_posts/**/*.md',
    './_sections/**/*.md'
  ],
  css: ['./_site/assets/css/style.css'],
  output: './_site/assets/css/style.css',
  safelist: {
    standard: [/^search/, /^highlight/, /^language/, /^rouge/, /^lineno/, /^code-/, /^table/]
  }
}
