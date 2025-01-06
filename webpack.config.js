const path = require('path');

module.exports = {
  entry: './src/index.js', // Archivo de entrada
  output: {
    filename: 'bundle.js', // Nombre del archivo de salida
    path: path.resolve(__dirname, 'dist'), // Directorio de salida
  },
  mode: 'development', // O 'production' si estás en producción
  module: {
    rules: [
      {
        test: /\.css$/, // Si estás usando CSS
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/, // Si estás usando Babel para transpilar JS
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
};
