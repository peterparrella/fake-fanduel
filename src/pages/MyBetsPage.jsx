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
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-white font-bold text-xl">My Bets</h1>
        <button
          onClick={onPlaceBet}
          className="px-4 py-1.5 rounded-full bg-fd-blue text-white font-semibold text-sm"
        >
          + New Bet
        </button>
      </div>

      <div className="flex gap-2 mb-4 bg-fd-card2 p-1 rounded-full border border-fd-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              tab === t.key ? "bg-fd-blue text-white" : "text-fd-gray"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-fd-gray text-sm text-center py-10">No {tab} bets.</p>
      ) : (
        <div className="space-y-3">
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
