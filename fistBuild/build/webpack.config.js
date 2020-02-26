const path = require('path'); // 引入node Path核心模块
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 引入html-webpack-plugin插件，自动引入打包生成的js文件到html文件中
const {CleanWebpackPlugin} = require('clean-webpack-plugin') // 每次打包清理前一次的打包文件 注意需要解构使用
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //  引入mini-css-extract-plugin插件，把css样式从js文件中提取到单独的css文件中。
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin') // 引入extract-text-webpack-plugin插件，拆分为一一对应的多个css文件
let indexLess = new ExtractTextWebpackPlugin('stylesheets/[name]-one.css');
let indexCss = new ExtractTextWebpackPlugin('stylesheets/[name]-two.css');

module.exports = {
  mode: 'development',
  entry: ["@babel/polyfill", path.resolve(__dirname,'../src/main.js')], // 使用babel-polyfill来帮助我们转换新api 例如(promise、Generator、Set、Maps、Proxy等)
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash:8].js'
  },
  module:{
    rules:[
      {
        test:/\.js$/, // 将 ES6/7/8语法转换为ES5语法，但是对新api并不会转换 例如(promise、Generator、Set、Maps、Proxy等)
        use:{
          loader:'babel-loader',
          options:{
            presets:['@babel/preset-env']
          }
        },
        exclude:/node_modules/
      },
      {
        test:/\.css$/,
        use: indexCss.extract({
          use: [
            // MiniCssExtractPlugin.loader, // 使用extract-text-webpack-plugin插件，就不要使用MiniCssExtractPlugin了
            'css-loader',
            {
              loader:'postcss-loader', // postcss-loader中的autoprefixer插件，可以帮助我们自动给那些可以添加厂商前缀的样式添加浏览器前缀（ -webkit   -moz   -ms   -o ）
              options:{
                  plugins:[require('autoprefixer')]
              }
            }
          ]
        })
      },
      {
        test:/\.less$/,
        use: indexLess.extract({
          use: [
            // MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
            {
              loader:'postcss-loader', // postcss-loader中的autoprefixer插件，可以帮助我们自动给那些可以添加厂商前缀的样式添加浏览器前缀（ -webkit   -moz   -ms   -o ）
              options:{
                  plugins:[require('autoprefixer')]
              }
            }
          ]
        })
      },
      {
        test: /\.(jpe?g|png|gif)$/i, //图片文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
    ]
  },
  plugins:[
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template:path.resolve(__dirname,'../index.html')
    }),
    indexLess,
    indexCss,
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
      chunkFilename: "[id].css",
    })
  ]
};