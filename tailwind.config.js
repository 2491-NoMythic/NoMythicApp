/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/index.css', './src/index/App.tsx', './src/**/*.{jsx,tsx,css,html}'],
    darkMode: 'class',
    theme: {
        extend: {},
    },
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
    daisyui: {
        themes: [
            {
                light: {
                    ...require('daisyui/src/colors/themes')['[data-theme=light]'],
                    error: '#CB4335',
                    'error-content': 'white',
                },
                dark: {
                    ...require('daisyui/src/colors/themes')['[data-theme=dark]'],
                    error: '#CB4335',
                    'error-content': 'white',
                },
            },
            'cyberpunk',
            'synthwave',
            'aqua',
            'coffee',
            'retro',
        ],
    },
}
