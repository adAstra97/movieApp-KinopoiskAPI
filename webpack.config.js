const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');


const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
   mode,
   target,
   devtool,
   devServer: {
      watchFiles: path.join(__dirname, 'src'),
      port: 3000,
      open: true,
      // hot: true,
   },
   entry: path.resolve(__dirname, 'src', 'index.js'),
   output: {
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      filename: '[name].[contenthash].js',
      assetModuleFilename: './images/[name][ext]',
      // assetModuleFilename: path.join('images', '[name][ext]'),
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: path.resolve(__dirname, 'src', 'index.pug'),
         filename: 'index.html',
         inject: 'body',
      }),
      new MiniCssExtractPlugin({
         filename: '[name].[contenthash].css',
      }),
      // new CopyPlugin({
      //    patterns: [{ from: './src/static', to: './' }],
      // }),
   ],
   module: {
      rules: [
         {
            test: /\.pug$/i,
            loader: 'pug-loader',
         },
         {
            test: /\.(c|sa|sc)ss$/i,
            use: [
               devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
               'css-loader',
               {
                  loader: 'postcss-loader',
                  options: {
                     postcssOptions: {
                        plugins: [require('postcss-preset-env')],
                     },
                  },
               },
               'group-css-media-queries-loader',
               {
                  loader: 'resolve-url-loader',
               },
               {
                  loader: 'sass-loader',
                  options: {
                     sourceMap: true,
                  },
               },
            ],
         },
         {
            test: /\.woff2?$/i,
            type: 'asset/resource',
            generator: {
               filename: 'fonts/[name][ext]',
            },
         },
         {
            test: /\.(jpe?g|png|webp|gif|svg)$/i,
            use: devMode
               ? []
               : [
                     {
                        loader: 'image-webpack-loader',
                        options: {
                           mozjpeg: {
                              progressive: true,
                           },
                           optipng: {
                              enabled: false,
                           },
                           pngquant: {
                              quality: [0.65, 0.9],
                              speed: 4,
                           },
                           gifsicle: {
                              interlaced: false,
                           },
                           webp: {
                              quality: 75,
                           },
                        },
                     },
                  ],
            type: 'asset/resource',
            // type: 'asset/inline',
         },
         {
            test: /\.m?js$/i,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: ['@babel/preset-env'],
               },
            },
         },
      ],
   },
};
