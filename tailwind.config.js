/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/index.css', './src/index/App.tsx', './src/**/*.{jsx,tsx,css,html}'],
    darkMode: 'class',
    theme: {
        extend: {
            animation: {
                'spin-slow': 'spin 4s linear infinite',
                'spin-once': 'spin 2s linear',
                'ping-slow': 'ping 4s cubic-bezier(1, 1, 0.2, 1) infinite',
            },
            keyframes: {
                spin: {
                    to: {
                        transform: 'rotate(-360deg)',
                    },
                },
            },
        },
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
            'halloween',
        ],
    },
}
