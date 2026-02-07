/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,html}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Prompt', 'system-ui', 'sans-serif'],
            },
            colors: {
                gemini: {
                    blue: '#4285f4',
                    purple: '#8e24aa',
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
