/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryPurple: '#a15df5',
        lightPurpleBg: '#ebdfff',
        darkPurple: '#7947ba',
        grayText: '#4a5568',
        ink: '#000000',
      },
      fontFamily: {
        sans: ['"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 45px rgba(161, 93, 245, 0.18)',
      },
    },
  },
  plugins: [],
};
