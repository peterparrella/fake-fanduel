function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="1.8" />
      <path
        d="M12 2.5l1 2.6 2.7-.9 1 2.7 2.8.3-.4 2.8 2.4 1.5-1.5 2.4 1.5 2.4-2.4 1.5.4 2.8-2.8.3-1 2.7-2.7-.9-1 2.6-1-2.6-2.7.9-1-2.7-2.8-.3.4-2.8-2.4-1.5 1.5-2.4-1.5-2.4 2.4-1.5-.4-2.8 2.8-.3 1-2.7 2.7.9z"
        stroke="#fff"
        strokeWidth="0"
        opacity="0"
      />
      <path
        d="M12 5v2M12 17v2M5 12h2M17 12h2M6.8 6.8l1.4 1.4M15.8 15.8l1.4 1.4M6.8 17.2l1.4-1.4M15.8 8.2l1.4-1.4"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header({ title = "FanDuel", onSettings }) {
  return (
    <header className="sticky top-0 z-30 bg-fd-navy/95 backdrop-blur border-b border-fd-border">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-lg tracking-tight">{title}</span>
        </div>
        <button
          onClick={onSettings}
          className="w-9 h-9 rounded-full bg-fd-card2 border border-fd-border flex items-center justify-center active:scale-95 transition"
          aria-label="Settings"
        >
          <GearIcon />
        </button>
      </div>
    </header>
  );
}
