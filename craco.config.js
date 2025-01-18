// craco.config.js
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // Optimization splits
            webpackConfig.optimization.splitChunks = {
                chunks: 'all',
                minSize: 20000,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        reuseExistingChunk: true,
                    },
                    recharts: {
                        test: /[\\/]node_modules[\\/](recharts)[\\/]/,
                        name: 'recharts',
                        chunks: 'all',
                    },
                    ui: {
                        test: /[\\/]components[\\/]ui[\\/]/,
                        name: 'ui-components',
                        chunks: 'all',
                        minChunks: 2,
                    },
                },
            };

            // Add compression plugin
            webpackConfig.plugins.push(
                new CompressionPlugin({
                    filename: '[path][base].gz',
                    algorithm: 'gzip',
                    test: /\.(js|css|html|svg)$/,
                    threshold: 10240,
                    minRatio: 0.8,
                })
            );

            // Add bundle analyzer in analyze mode
            if (process.env.ANALYZE) {
                webpackConfig.plugins.push(
                    new BundleAnalyzerPlugin({
                        analyzerMode: 'server',
                    })
                );
            }

            return webpackConfig;
        },
    },
};