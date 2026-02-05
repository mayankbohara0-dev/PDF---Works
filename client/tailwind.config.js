/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#3b82f6", // Blue-500
                secondary: "#1e293b", // Slate-800
                accent: "#f59e0b", // Amber-500
                dark: {
                    900: "#0f172a", // Slate-900
                    800: "#1e293b", // Slate-800
                    700: "#334155", // Slate-700
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
