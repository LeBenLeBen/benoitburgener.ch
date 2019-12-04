module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('precss'),
    require('autoprefixer'),
    require('@fullhuman/postcss-purgecss')({
      content: ['dist/**/*.html'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
