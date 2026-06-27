const NAV_ITEMS = [
  { key: "home", label: "Home", icon: HomeIcon },
  { key: "sports", label: "All Sports", icon: SportsIcon },
  { key: "bets", label: "My Bets", icon: BetsIcon },
  { key: "live", label: "Live Now", icon: LiveIcon },
  { key: "account", label: "Account", icon: AccountIcon },
];

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 3l9 7.5"
        stroke={active ? "#1493ff" : "#8b94a7"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 9.5V20a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9.5"
        stroke={active ? "#1493ff" : "#8b94a7"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SportsIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={active ? "#1493ff" : "#8b94a7"} strokeWidth="2" />
      <path
        d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"
        stroke={active ? "#1493ff" : "#8b94a7"}
        strokeWidth="2"
      />
    </svg>
  );
}

function BetsIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke={active ? "#1493ff" : "#8b94a7"} strokeWidth="2" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke={active ? "#1493ff" : "#8b94a7"} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LiveIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill={active ? "#1493ff" : "#8b94a7"} />
      <path
        d="M7 7a7 7 0 000 10M17 7a7 7 0 010 10M4 4a11 11 0 000 16M20 4a11 11 0 010 16"
        stroke={active ? "#1493ff" : "#8b94a7"}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AccountIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={active ? "#1493ff" : "#8b94a7"} strokeWidth="2" />
      <path
        d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6"
        stroke={active ? "#1493ff" : "#8b94a7"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-fd-navy border-t border-fd-border">
      <div className="max-w-lg mx-auto grid grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className="flex flex-col items-center justify-center gap-1 py-2.5"
            >
              <Icon active={isActive} />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-fd-blue" : "text-fd-gray"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
