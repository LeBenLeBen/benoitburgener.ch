const Nunjucks = require('nunjucks');

module.exports = function(eleventy) {
  eleventy.setBrowserSyncConfig(require('./browser-sync.config.js'));

  let nunjucksEnvironment = new Nunjucks.Environment(
    new Nunjucks.FileSystemLoader(['src/_includes', 'src/_layouts'], {
      watch: true,
    })
  );
  eleventy.setLibrary('njk', nunjucksEnvironment);

  eleventy.addPassthroughCopy('./src/assets/images');
  eleventy.addPassthroughCopy('./src/assets/icons');

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
