const webpack = require('webpack');
const path = require('path');
const jsBuildPath = path.resolve(__dirname, 'dist/jscripts/');

module.exports = {
    entry: [
      //'webpack/hot/only-dev-server',
      "./src/jscripts/app.jsx"
    ],
    output: {
        path: jsBuildPath,
        filename: "app.js"
    },
    module: {
        loaders: [
            { test: /\.js|jsx?$/, loaders: ['react-hot', 'babel'], include: __dirname + '/src/jscripts/'}
        ]
    },
    resolve:{
        extensions:['','.js','.jsx','.json']
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ]
};