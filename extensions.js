const path = require('path');
const Image = require('@11ty/eleventy-img');
const classNames = require('classnames');
const { DateTime } = require('luxon');

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
  return Image.generateHTML(metadata, attributes, { whitespaceMode: 'inline' });
}

/**
 * Generate a space-separated string from a string/array/object of class names
 * while omitting nil values.
 */
function classNamesFunction(...cls) {
  return classNames(cls);
}

/**
 * Format a date object using Luxon.
 */
function formatDate(dateObj) {
  return DateTime.fromJSDate(dateObj)
    .setZone('Europe/Zurich')
    .toLocaleString(DateTime.DATE_FULL);
}

/**
 * Split a string into lines of a maximum length.
 */
function splitLines(input) {
  const parts = input.split(' ');
  const lines = parts.reduce(function (prev, current) {
    if (!prev.length) {
      return [current];
    }

    let lastOne = prev[prev.length - 1];

    if (lastOne.length + current.length > 21) {
      return [...prev, current];
    }

    prev[prev.length - 1] = lastOne + ' ' + current;

    return prev;
  }, []);

  return lines;
}

module.exports = {
  imageShortcode,
  classNamesFunction,
  formatDate,
  splitLines,
};
