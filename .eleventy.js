const Nunjucks = require('nunjucks');

module.exports = function (eleventy) {
  eleventy.setBrowserSyncConfig(require('./browser-sync.config.js'));

  let nunjucksEnvironment = new Nunjucks.Environment(
    new Nunjucks.FileSystemLoader(['src/_includes', 'src/_layouts'], {
      watch: process.argv.includes('--serve'),
    })
  );
  eleventy.setLibrary('njk', nunjucksEnvironment);

  // Minify HTML output
  eleventy.addTransform('minify', require('./lib/transforms/minify.js'));

  eleventy.addPassthroughCopy('./src/favicon.ico');
  eleventy.addPassthroughCopy('./src/assets/images');
  eleventy.addPassthroughCopy('./src/assets/icons');
  eleventy.addPassthroughCopy('./src/assets/fonts');

  return {
    dir: {
      input: 'src',
      output: 'dist',
      layouts: '_layouts',
    },
    templateFormats: ['njk', 'md'],
    passthroughFileCopy: true,
  };
};
