const path = require('path');

module.exports = {
    entry: {
        'isomer-gl': '.',
    },
    output: {
        library: 'IsomerGL',
        libraryTarget: 'umd',
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },
    mode: process.env['NODE_ENV'] == 'production' ? 'production' : 'development',
};
