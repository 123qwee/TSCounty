var path = require("path");
var Builder = require('systemjs-builder');

var builder = new Builder('./');
builder.config({
  map: {
    'systemjs-babel-build': './node_modules/systemjs-plugin-babel/systemjs-babel-node.js',
    'text': './src/static/config/js/text.js',
    'ulid': './src/static/config/js/ulid.js',
  },
  meta: {
    '*.html': {
      loader: 'text'
    },
    '*.js': {
      babelOptions: {
        es2015: false
      }
    },
  },
});
builder.bundle('./src/main.js', 'out-bundle.js', {
  sourceMaps: true,
  normalize: true,
  runtime: true,
  minify: true,
  mangle: false,
  format: 'cjs'
}); // create a named bundle
builder.buildStatic('./src/main.js', 'out-static.js', {
  sourceMaps: true,
  normalize: true,
  runtime: true,
  minify: true,
  mangle: false,
  format: 'umd'
}); // create a static optimized build
