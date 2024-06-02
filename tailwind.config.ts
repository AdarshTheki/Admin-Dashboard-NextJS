import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        fontSize: {
            'heading1-bold': [
                '50px',
                {
                    lineHeight: '100%',
                    fontWeight: '700',
                },
            ],
            'heading2-bold': [
                '30px',
                {
                    lineHeight: '100%',
                    fontWeight: '700',
                },
            ],
            'heading3-bold': [
                '24px',
                {
                    lineHeight: '100%',
                    fontWeight: '700',
                },
            ],
            'heading4-bold': [
                '20px',
                {
                    lineHeight: '100%',
                    fontWeight: '700',
                },
            ],
            'body-bold': [
                '18px',
                {
                    lineHeight: '100%',
                    fontWeight: '700',
                },
            ],
            'body-semibold': [
                '18px',
                {
                    lineHeight: '100%',
                    fontWeight: '600',
                },
            ],
            'body-medium': [
                '18px',
                {
                    lineHeight: '100%',
                    fontWeight: '500',
                },
            ],
            'base-bold': [
                '16px',
                {
                    lineHeight: '100%',
                    fontWeight: '600',
                },
            ],
            'base-medium': [
                '16px',
                {
                    lineHeight: '100%',
                    fontWeight: '500',
                },
            ],
        },
        extend: {
            colors: {
                'white-1': '#F8F8F8',
                'grey-1': '#434656',
                'grey-2': '#E5E7EB',
                'blue-1': '#8B3EE7',
                'blue-2': '#F3ECFF',
                'green-1': '#008957',
                'blue-3': '#F5F7F9',
                'red-1': '#D31C1C',
            },
        },
    },
    plugins: [],
};
export default config;
