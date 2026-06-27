import { useState } from "react";
import { useAppState } from "../lib/AppState";
import BetCard from "../components/BetCard";

const TABS = [
  { key: "open", label: "Open" },
  { key: "settled", label: "Settled" },
  { key: "saved", label: "Saved" },
];

export default function MyBetsPage({ onMarkWin, onMarkLoss, onLegToggle, onActivate, onDelete, onPlaceBet }) {
  const { bets } = useAppState();
  const [tab, setTab] = useState("open");

  const filtered = bets.filter((b) => {
    if (tab === "open") return b.status === "open";
    if (tab === "settled") return b.status === "win" || b.status === "loss";
    return b.status === "saved";
  });

  return (
    <div>
      <div className="relative px-4 pt-4 pb-3 flex items-center justify-center">
        <h1 className="text-white font-bold text-[19px]">My Bets</h1>
        <button
          onClick={onPlaceBet}
          className="absolute right-4 px-3 py-1.5 rounded-full bg-fd-blue text-white font-semibold text-xs"
        >
          + New Bet
        </button>
      </div>

      <div className="flex border-b border-fd-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-3 text-[14px] font-bold border-b-2 transition ${
              tab === t.key ? "text-fd-blue border-fd-blue" : "text-fd-gray/70 border-transparent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-fd-border">
        <FilterPill label={tab === "settled" ? "NY" : "All"} />
        <FilterPill label="All" />
        <span className="flex-1" />
        <FilterPill label="Recent" />
      </div>

      {filtered.length === 0 ? (
        <p className="text-fd-gray text-sm text-center py-10">No {tab} bets.</p>
      ) : (
        <div className="flex flex-col gap-2 bg-fd-bg">
          {filtered.map((bet) => (
            <BetCard
              key={bet.id}
              bet={bet}
              onMarkWin={onMarkWin}
              onMarkLoss={onMarkLoss}
              onLegToggle={onLegToggle}
              onActivate={onActivate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({ label }) {
  return (
    <span className="inline-flex items-center gap-1 border border-fd-border rounded text-fd-gray text-[11px] font-semibold uppercase px-2 py-1">
      {label}
      <svg width="9" height="9" viewBox="0 0 24 24">
        <path d="M6 9l6 6 6-6" stroke="#8a8d93" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    </span>
  );
}
