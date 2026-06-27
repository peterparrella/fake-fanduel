import { Pill } from "../components/Pill";

const SPORTS = [
  { name: "MLB", icon: "⚾" },
  { name: "NFL", icon: "🏈" },
  { name: "NBA", icon: "🏀" },
  { name: "NHL", icon: "🏒" },
  { name: "Soccer", icon: "⚽" },
  { name: "NCAAF", icon: "🏈" },
  { name: "NCAAB", icon: "🏀" },
  { name: "Tennis", icon: "🎾" },
  { name: "Golf", icon: "⛳" },
  { name: "MMA/Boxing", icon: "🥊" },
];

export default function AllSportsPage({ onPlaceBet }) {
  return (
    <div className="px-4 py-4">
      <h1 className="text-white font-bold text-xl mb-4">All Sports</h1>
      <div className="grid grid-cols-2 gap-3">
        {SPORTS.map((s) => (
          <button
            key={s.name}
            onClick={onPlaceBet}
            className="rounded-2xl bg-fd-card border border-fd-border p-4 flex items-center gap-3 text-left active:scale-[0.98] transition"
          >
            <span className="text-2xl">{s.icon}</span>
            <span className="text-white font-semibold text-sm">{s.name}</span>
          </button>
        ))}
      </div>
      <p className="text-fd-gray text-xs mt-4 text-center">
        Tap a sport to log a new bet. <Pill color="blue">Tracker mode</Pill>
      </p>
    </div>
  );
}
