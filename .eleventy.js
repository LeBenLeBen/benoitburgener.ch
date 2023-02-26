const Nunjucks = require('nunjucks');
const { imageShortcode, classNamesFunction } = require('./extensions.js');

module.exports = function (eleventyConfig) {
  eleventyConfig.setServerOptions({
    watch: ['dist/**/*'],
    port: 3000,
  });

  // Use Nunjucks as a template engine
  let nunjucksEnvironment = new Nunjucks.Environment(
    new Nunjucks.FileSystemLoader(['src/_includes', 'src/_layouts'], {
      watch: process.argv.includes('--serve'),
    })
  );
  eleventyConfig.setLibrary('njk', nunjucksEnvironment);

  // Add extra features to Nunjucks templates
  eleventyConfig.addNunjucksShortcode('image', imageShortcode);
  eleventyConfig.addNunjucksGlobal('classNames', classNamesFunction);

  // Minify HTML output
  eleventyConfig.addTransform('minify', require('./lib/transforms/minify.js'));

  // Copy static assets to dist
  eleventyConfig.addPassthroughCopy('./src/favicon.ico');
  eleventyConfig.addPassthroughCopy('./src/assets/images');
  eleventyConfig.addPassthroughCopy('./src/assets/icons');
  eleventyConfig.addPassthroughCopy('./src/assets/fonts');

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
