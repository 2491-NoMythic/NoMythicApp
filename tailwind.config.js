/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/index.css',
        './src/index/App.tsx',
        './src/**/*.{jsx,tsx,css,html}',
    ],
    darkMode: 'class',
    theme: {
        extend: {},
    },
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
