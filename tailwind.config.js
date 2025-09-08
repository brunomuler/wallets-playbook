/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./docs/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./blog/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./docusaurus.config.js",
  ],
  safelist: [
    'icon-[heroicons--document-text]',
    'icon-[heroicons--code-bracket]', 
    'icon-[heroicons--beaker]',
    'icon-[simple-icons--discord]',
    'icon-[simple-icons--stackexchange]',
    'icon-[simple-icons--github]',
    'icon-[heroicons--chat-bubble-left-right]',
    'icon-[heroicons--wallet]',
    'icon-[heroicons--currency-dollar]',
    'icon-[heroicons--arrows-up-down]',
    'icon-[heroicons--chart-bar]',
    'icon-[heroicons--building-library]',
    'icon-[heroicons--squares-2x2]',
    'icon-[heroicons--chart-pie]',
    'icon-[heroicons--paper-airplane]',
    'icon-[heroicons--rocket-launch]',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // Disable some Tailwind features that might conflict with Docusaurus
    preflight: false,
  },
}
