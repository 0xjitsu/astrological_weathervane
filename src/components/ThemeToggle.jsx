import { useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-lg transition-all duration-300 cursor-pointer"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-secondary)',
      }}
    >
      <span
        className="inline-block text-lg leading-none transition-transform duration-500"
        style={{ transform: dark ? 'rotate(0deg)' : 'rotate(180deg)' }}
      >
        {dark ? '☀' : '☽'}
      </span>
    </button>
  );
}
