export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        brand: ['var(--font-brand)', 'sans-serif'],
      },
      borderRadius: {
        brand: 'var(--radius-brand)',
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
      }
    }
  },
  plugins: [
    "@tailwindcss/forms",
    "@tailwindcss/typography"
  ]
};
