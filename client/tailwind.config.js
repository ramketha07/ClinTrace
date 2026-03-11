/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: "#3b82f6",
                    hover: "#60a5fa",
                    dark: "#2563eb",
                },
                secondary: {
                    DEFAULT: "#8b5cf6",
                    hover: "#a78bfa",
                    dark: "#7c3aed",
                },
                accent: {
                    DEFAULT: "#10b981",
                    hover: "#34d399",
                    dark: "#059669",
                },
                background: "#09090b", // slate-950/zinc-950 dark tone
                surface: "#111115",
                surfaceHover: "#18181c",
                border: "rgba(255, 255, 255, 0.08)",
                textPrimary: "#f8fafc",
                textSecondary: "#94a3b8",
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            backgroundImage: {
                'grid-pattern': "url('data:image/svg+xml,%3Csvg width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z\" fill=\"rgba(255,255,255,0.07)\"%3E%3C/path%3E%3C/svg%3E')",
            }
        },
    },
    plugins: [],
}
