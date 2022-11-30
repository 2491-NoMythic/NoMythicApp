module.exports = {
    env: {
        test: {
            presets: [['@babel/preset-env']],
        },
    },

    presets: [
        ['@babel/preset-env', { targets: 'defaults', modules: false }],
        '@babel/preset-typescript',
        ['babel-preset-solid', { delegateEvents: false }],
    ],

    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties',
        'babel-plugin-transform-vite-meta-env',
    ],
}
