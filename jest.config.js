module.exports = {
    preset: 'solid-jest/preset/browser',
    moduleNameMapper: {
        'assets/(.*)': require.resolve('./test/file-mock.js'),
    },
    roots: ['./test/'],
}
