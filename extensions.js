import path from 'path';
import Image from '@11ty/eleventy-img';
import classNames from 'classnames';
import { DateTime } from 'luxon';

/**
 * Generate multiple sizes of an image and return the corresponding HTML
 * as a <picture> element.
 */
export function imageShortcode(src, attrs) {
  src = path.resolve(import.meta.dirname, 'src/assets/images/', src);
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
export function classNamesFunction(...cls) {
  return classNames(cls);
}

/**
 * Format a date object using Luxon.
 */
export function formatDate(dateObj) {
  return DateTime.fromJSDate(dateObj)
    .setZone('Europe/Zurich')
    .toLocaleString(DateTime.DATE_FULL);
}

/**
 * Split a string into lines of a maximum length.
 */
export function splitLines(input) {
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
