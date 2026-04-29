/** @type {import('tailwindcss').Config} */
const colorVar = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

export default {
    darkMode: ['class', '[data-theme="dark"]'],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: colorVar('--color-primary-50'),
                    100: colorVar('--color-primary-100'),
                    200: colorVar('--color-primary-200'),
                    500: colorVar('--color-primary-500'),
                    600: colorVar('--color-primary-600'),
                    700: colorVar('--color-primary-700'),
                },
                gray: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
                white: colorVar('--color-white'),
                black: colorVar('--color-black'),
                background: colorVar('--color-background'),
                surface: colorVar('--color-surface'),
                'surface-muted': colorVar('--color-surface-muted'),
                border: colorVar('--color-border'),
                'text-primary': colorVar('--color-text-primary'),
                'text-muted': colorVar('--color-text-muted'),
            },
            fontFamily: {
                sans:    ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
                heading: ['"Inter"', 'system-ui', 'sans-serif'],
                body:    ['"Inter"', 'system-ui', 'sans-serif'],
                mono:    ['"JetBrains Mono"', 'monospace'],
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
            },
            boxShadow: {
                'sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            }
        },
    },
    plugins: [],
}
