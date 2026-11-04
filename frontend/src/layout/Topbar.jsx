import { useEffect, useState } from 'react';
import { Search, Sun, Moon, Bell } from 'lucide-react';

export default function Topbar({ title, subtitle }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('wm-theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wm-theme', theme);
  }, [theme]);

  return (
    <header className="h-16 px-8 flex items-center gap-4 bg-base/60 backdrop-blur border-b border-line sticky top-0 z-20">
      <div className="flex-1 min-w-0">
        <h1 className="text-[15px] font-semibold text-fg leading-tight">{title}</h1>
        {subtitle && <p className="text-[12px] text-fg-muted">{subtitle}</p>}
      </div>

      <div className="relative hidden md:block">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint" />
        <input
          placeholder="Buscar…  ⌘K"
          className="w-64 h-9 pl-9 pr-3 rounded-lg bg-elevated border border-line text-[13px] text-fg placeholder:text-fg-faint focus-ring"
        />
      </div>

      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Cambiar tema"
        className="size-9 grid place-items-center rounded-lg border border-line bg-elevated text-fg-muted hover:text-fg hover:border-line-strong transition focus-ring"
      >
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      <button className="relative size-9 grid place-items-center rounded-lg border border-line bg-elevated text-fg-muted hover:text-fg hover:border-line-strong transition focus-ring">
        <Bell size={15} />
        <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-danger" />
      </button>
    </header>
  );
}