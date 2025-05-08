/** @type {import('tailwindcss').Config} */
import tailwindForms from '@tailwindcss/forms';
import tailwindTypography from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindForms,
    tailwindTypography,
  ],
}