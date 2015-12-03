const webpackConfig = require('./webpack.config');

module.exports = function karmaConf(config) {
    config.set({
        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        files: [
            {pattern: 'tests.webpack.js', watched: true},
        ],
        preprocessors: {
            'tests.webpack.js': ['webpack', 'sourcemap'],
        },
        webpack: {
            devtool: 'inline-source-map',
            module: webpackConfig.module,
            watch: true,
        },
        webpackServer: {
            noInfo: true,
        },
        reporters: ['mocha', 'junit'],
        junitReporter: {
            outputDir: './reports',
        },
        autoWatch: true,
        singleRun: true,
    });
};
