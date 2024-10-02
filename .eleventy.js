import fs from 'fs';
import Nunjucks from 'nunjucks';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import {
  imageShortcode,
  classNamesFunction,
  formatDate,
  splitLines,
} from './extensions.js';
import Image from '@11ty/eleventy-img';
import rss from '@11ty/eleventy-plugin-rss';

import minify from './lib/transforms/minify.js';

export default function (eleventyConfig) {
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
  eleventyConfig.addFilter('formatDate', formatDate);
  eleventyConfig.addFilter('splitLines', splitLines);

  // Minify HTML output
  eleventyConfig.addTransform('minify', minify);

  // Copy static assets to dist
  eleventyConfig.addPassthroughCopy('./src/favicon.ico');
  eleventyConfig.addPassthroughCopy('./src/assets/images');
  eleventyConfig.addPassthroughCopy('./src/assets/icons');
  eleventyConfig.addPassthroughCopy('./src/assets/fonts');

  // Vendor plugins
  eleventyConfig.addPlugin(syntaxHighlight, {
    templateFormats: ['md'],
  });
  eleventyConfig.addPlugin(rss);

  // Build images for open-graph
  eleventyConfig.on('afterBuild', () => {
    const socialPreviewImagesDir = './dist/assets/images/_generated/og/';

    fs.readdir(socialPreviewImagesDir, function (err, files) {
      if (files.length > 0) {
        files.forEach(async function (filename) {
          if (filename.endsWith('.svg')) {
            let imageUrl = socialPreviewImagesDir + filename;

            await Image(imageUrl, {
              formats: ['jpeg'],
              outputDir: './src/assets/images/_generated/og/',
              filenameFormat: function (id, src, width, format, options) {
                let outputFilename = filename.substring(0, filename.length - 4);
                return `${outputFilename}.${format}`;
              },
            });
          }
        });
      }
    });
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
      layouts: '_layouts',
    },
    templateFormats: ['njk', 'md'],
    markdownTemplateEngine: 'njk',
    passthroughFileCopy: true,
  };
}
