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
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                heading: ['"Outfit"', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: "#4F46E5", // Elegant Indigo
                    hover: "#6366F1",
                    dark: "#4338CA",
                    light: "#818CF8" 
                },
                secondary: {
                    DEFAULT: "#0EA5E9", // Vibrant Sky
                    hover: "#38BDF8",
                    dark: "#0284C7",
                },
                accent: {
                    DEFAULT: "#10B981", // Emerald
                    hover: "#34D399",
                    dark: "#059669",
                },
                background: "#030712", // Deeper dark
                surface: "rgba(17, 24, 39, 0.7)", // glassmorphism
                surfaceHover: "rgba(31, 41, 55, 0.8)",
                border: "rgba(255, 255, 255, 0.08)",
                textPrimary: "#F8FAFC", 
                textSecondary: "#94A3B8", 
            },
            animation: {
                'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(24px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(79, 70, 229, 0.2))' },
                    '50%': { filter: 'drop-shadow(0 0 20px rgba(79, 70, 229, 0.5))' },
                }
            },
            backgroundImage: {
                'grid-pattern': "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0H40V40H0V0Z\" fill=\"transparent\"/%3E%3Cpath d=\"M0 0H40\" stroke=\"rgba(255,255,255,0.03)\" stroke-width=\"1\"/%3E%3Cpath d=\"M0 0V40\" stroke=\"rgba(255,255,255,0.03)\" stroke-width=\"1\"/%3E%3C/svg%3E')",
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
