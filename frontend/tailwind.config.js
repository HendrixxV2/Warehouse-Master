/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        base:     'var(--bg-base)',
        elevated: 'var(--bg-elevated)',
        subtle:   'var(--bg-subtle)',
        line:     { DEFAULT: 'var(--border)', strong: 'var(--border-strong)' },
        fg:       { DEFAULT: 'var(--text-primary)', muted: 'var(--text-secondary)', faint: 'var(--text-tertiary)' },
        accent:   { DEFAULT: 'var(--accent)', hover: 'var(--accent-hover)', muted: 'var(--accent-muted)' },
        success:  'var(--success)',
        warning:  'var(--warning)',
        danger:   'var(--danger)',
        info:     'var(--info)',
        sidebar: {
          bg:      'var(--sidebar-bg)',
          border:  'var(--sidebar-border)',
          text:    'var(--sidebar-text)',
          active:  'var(--sidebar-text-active)',
          hover:   'var(--sidebar-item-hover)',
          accent:  'var(--sidebar-item-active)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { xl: '10px', '2xl': '14px', '3xl': '18px' },
      boxShadow: { card: 'var(--shadow-card)', modal: 'var(--shadow-modal)' },
      transitionDuration: { DEFAULT: '150ms' },
    },
  },
  plugins: [],
};