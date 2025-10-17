module.exports = {
  theme: {
    extend: {
      colors: {
        'body-bg-dark': 'var(--body-bg-dark)',
        'body-bg-light': 'var(--body-bg-light)',
        'header-bg': 'var(--header-bg)',
        'footer-bg': 'var(--footer-bg)',
      },
    },
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
}