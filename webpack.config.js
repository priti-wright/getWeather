const packageJson = require('./package');

module.exports = {
    entry: './' + packageJson.main,
    output: {
        path: __dirname + '/dist',
        filename: packageJson.name + '.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx*$/,
                exclude: /node_modules(?!\/@energysavvy)/,
                loader: 'babel-loader',
            },
            {
                test: /\.png$|\.svg$/,
                loader: 'file',
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass?sourceMap',
            },
        ],
    },
};
