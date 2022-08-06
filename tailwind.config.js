/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern": "url('assets/images/hero-img.svg')",
      },
      keyframes: {
        'miru-breathing': {
          '0%': { 'transform': 'translate(5px, 5px)' },
          '100%': { 'transform': 'translate(-5px, -5px)' },
        }
      }
    },
  },
};
