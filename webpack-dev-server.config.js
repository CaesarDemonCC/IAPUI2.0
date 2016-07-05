const webpack = require('webpack');
const path = require('path');
const jsBuildPath = path.resolve(__dirname, 'dist/jscripts/');

module.exports = {
    entry: [
        path.join(__dirname, 'src/jscripts/app.jsx'),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist/'), // Relative directory for base of server
        //devtool: 'eval',
        hot: true, // Live-reload
        inline: true,
        port: 8080, // Port Number
        host: '0.0.0.0', // Change to '0.0.0.0' for external facing server
        proxy: {
            '/swarm.cgi': {
                  target: 'https://10.65.68.19:4343/swarm.cgi',
                  secure: false,
            }
        },
    },
    //devtool: 'eval',
    output: {
        //path: jsBuildPath,
        publicPath: '/jscripts/',
        filename: "app.js"
    },
    module: {
        loaders: [
            { test: /\.js|jsx?$/, loaders: ['react-hot', 'babel-loader'], include: path.join(__dirname, 'src/jscripts/')}
        ]
    },
    resolve:{
        extensions:['','.js','.jsx','.json']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ]
};