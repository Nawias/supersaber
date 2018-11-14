var MinifyPlugin = require('babel-minify-webpack-plugin');
var Nunjucks = require('nunjucks');
var fs = require('fs');
var htmlMinify = require('html-minifier').minify;
var ip = require('ip');
var path = require('path');
var webpack = require('webpack');

// Set up templating.
var nunjucks = Nunjucks.configure(path.resolve(__dirname, 'src'), {
  noCache: true
});
nunjucks.addGlobal('DEBUG_KEYBOARD', !!process.env.DEBUG_KEYBOARD);
nunjucks.addGlobal('HOST', ip.address());
nunjucks.addGlobal('IS_PRODUCTION', process.env.NODE_ENV === 'production');

// Initial Nunjucks render.
fs.writeFileSync('index.html', nunjucks.render('index.html'));

// For development, watch HTML for changes to compile Nunjucks.
// The production Express server will handle Nunjucks by itself.
if (process.env.NODE_ENV !== 'production') {
  fs.watch('src', { recursive: true }, (eventType, filename) => {
    if (filename.indexOf('.html') === -1) {
      return;
    }
    try {
      fs.writeFileSync('index.html', nunjucks.render('index.html'));
    } catch (e) {
      console.error(e);
    }
  });
}

PLUGINS = [new webpack.EnvironmentPlugin(['NODE_ENV'])];
if (process.env.NODE_ENV === 'production') {
  PLUGINS.push(
    new MinifyPlugin(
      {
        booleans: true,
        builtIns: true,
        consecutiveAdds: true,
        deadcode: true,
        evaluate: false,
        flipComparisons: true,
        guards: true,
        infinity: true,
        mangle: false,
        memberExpressions: true,
        mergeVars: true,
        numericLiterals: true,
        propertyLiterals: true,
        regexpConstructors: true,
        removeUndefined: true,
        replace: true,
        simplify: true,
        simplifyComparisons: true,
        typeConstructors: true,
        undefinedToVoid: true,
        keepFnName: true,
        keepClassName: true,
        tdz: true
      },
      {
        sourceMap: 'source-map'
      }
    )
  );
}

module.exports = {
  devtool: '#inline-source-map',
  devServer: {
    disableHostCheck: true
  },
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: 'build/build.js'
  },
  plugins: PLUGINS,
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: path =>
          path.indexOf('node_modules') !== -1 || path.indexOf('panel') !== -1,
        loader: 'babel-loader'
      },
      {
        test: /\.glsl/,
        exclude: /(node_modules)/,
        loader: 'webpack-glsl-loader'
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg)/,
        loader: 'url-loader'
      }
    ]
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules')]
  }
};
