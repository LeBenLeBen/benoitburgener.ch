const path = require('path');
const Image = require('@11ty/eleventy-img');
const classNames = require('classnames');

/**
 * Generate multiple sizes of an image and return the corresponding HTML
 * as a <picture> element.
 */
function imageShortcode(src, attrs) {
  src = path.resolve(__dirname, 'src/assets/images/', src);
  let options = {
    widths: [400, 600, 800, 1000, 1200],
    formats: ['webp', 'jpg'],
    outputDir: './src/assets/images/_generated/',
    urlPath: '/assets/images/_generated/',
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);

      return `${name}-${width}w.${format}`;
    },
  };

  Image(src, options);

  let attributes = Object.assign(
    {
      sizes: '100vw',
      alt: '',
      loading: 'lazy',
      decoding: 'async',
    },
    attrs
  );

  // get metadata even if the images are not fully generated yet
  let metadata = Image.statsSync(src, options);
  return Image.generateHTML(metadata, attributes);
}

/**
 * Generate a space-separated string from a string/array/object of class names
 * while omitting nil values.
 */
function classNamesFunction(...cls) {
  return classNames(cls);
}

module.exports = {
  imageShortcode,
  classNamesFunction,
};
