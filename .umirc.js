/*
 * Descripttion:
 * Author: Gaven Xu
 * Date: 2019-06-20 18:28:33
 * LastEditors: jinhui
 * LastEditTime: 2019-08-22 17:13:48
 */
const path = require('path');
// ref: https://umijs.org/config/
export default {
  history: 'hash',
  treeShaking: true,
  hash: true,
  outputPath: './dist',
  // base: '/Book/',
  // publicPath: '/Book/',
  runtimePublicPath: false,
  // exportStatic: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: {
        webpackChunkName: true,
        level: 1
      },
      title: 'Book',
      dll: false,
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  cssModulesExcludes:[
    path.resolve(__dirname, 'src/components/homeIndex/swiper.min.css'),
    path.resolve(__dirname, 'src/global.css'),
  ],
  alias: {
    components: path.resolve(__dirname, 'src/components'),
    services: path.resolve(__dirname, 'src/services'),
    models: path.resolve(__dirname, 'src/models'),
    '@/utils': path.resolve(__dirname, 'src/utils')
  }
}
