const path = require('path');

module.exports = {
  entry: {
    insertViewBundle: './src/insertView.js',
    receiptViewBundle: './src/receiptView.js',
    statisticViewBundle: './src/statisticView.js'
  },
  output: {
    // filename: 'receiptViewBundled.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  watch: true
};