var webpack = require('webpack');
module.exports = {
    entry: [
      //'webpack/hot/only-dev-server',
      "./src/jscripts/app.jsx"
    ],
    output: {
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