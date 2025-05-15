/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                'telegraf': ['PPTelegraf', 'sans-serif'],
                'sao': ['SAO UI', 'Arial', 'Helvetica', 'sans-serif'],
                'montserrat': ['Montserrat', 'sans-serif'],
            },
        },
    },
    plugins: [],
    safelist: [
        'font-telegraf',
        'font-sao',
        'font-montserrat'
    ]
} 