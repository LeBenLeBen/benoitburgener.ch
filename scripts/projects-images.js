/**
 * Takes all projects ".png" images and generates various sizes
 * in both JPEG and WEBP format to be used in a <picture>
 */

const path = require('path');
const glob = require('glob');
const sharp = require('sharp');

const sizes = [
  {
    suffix: 'xs',
    width: 400,
  },
  {
    suffix: 'sm',
    width: 600,
  },
  {
    suffix: 'md',
    width: 800,
  },
  {
    suffix: 'lg',
    width: 1000,
  },
  {
    suffix: 'xl',
    width: 1200,
  },
];

glob('src/assets/images/projects/**.png', {}, function(er, files) {
  files.forEach(file => {
    const image = sharp(file);
    const { dir, name } = path.parse(file);

    sizes.forEach(size => {
      const resizedImage = image.resize({ width: size.width });
      resizedImage
        .jpeg({
          quality: 90,
        })
        .toFile(`${dir}/${name}-${size.suffix}.jpg`);
      resizedImage
        .webp({
          quality: 85,
        })
        .toFile(`${dir}/${name}-${size.suffix}.webp`);
    });
  });
});
