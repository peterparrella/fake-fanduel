import { useAppState } from "../lib/AppState";
import BetCard from "../components/BetCard";

export default function HomePage({ onPlaceBet, onMarkWin, onMarkLoss, onLegToggle }) {
  const { balance, stats, bets } = useAppState();
  const recent = bets.filter((b) => !b.savedOnly).slice(0, 5);
  const record = `${stats.wins}-${stats.losses}`;

  return (
    <div className="px-4 py-4 space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-fd-card2 to-fd-card border border-fd-border p-5">
        <p className="text-fd-gray text-sm font-medium">Current Balance</p>
        <p className="text-white text-4xl font-extrabold mt-1 tracking-tight">
          ${balance.toFixed(2)}
        </p>
        <button
          onClick={onPlaceBet}
          className="mt-4 w-full py-3 rounded-full bg-fd-blue text-white font-bold active:scale-[0.98] transition"
        >
          Place a Bet
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatBox label="Total Wagered" value={`$${stats.totalWagered.toFixed(2)}`} />
        <StatBox
          label="Total Profit/Loss"
          value={`${stats.totalProfit >= 0 ? "+" : ""}$${stats.totalProfit.toFixed(2)}`}
          positive={stats.totalProfit >= 0}
        />
        <StatBox
          label="ROI %"
          value={`${stats.roi >= 0 ? "+" : ""}${stats.roi.toFixed(1)}%`}
          positive={stats.roi >= 0}
        />
        <StatBox label="Record (W-L)" value={record} />
      </div>

      <div>
        <h2 className="text-white font-bold text-base mb-3">Recent Bets</h2>
        {recent.length === 0 ? (
          <p className="text-fd-gray text-sm">No bets yet. Place your first bet to get started.</p>
        ) : (
          <div className="space-y-3 -mx-4">
            {recent.map((bet) => (
              <div key={bet.id} className="border-y border-fd-border">
                <BetCard bet={bet} onMarkWin={onMarkWin} onMarkLoss={onMarkLoss} onLegToggle={onLegToggle} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, positive }) {
  return (
    <div className="rounded-xl bg-fd-card border border-fd-border p-3">
      <p className="text-fd-gray text-[11px] font-medium">{label}</p>
      <p
        className={`text-lg font-bold mt-0.5 ${
          positive === undefined ? "text-white" : positive ? "text-fd-green" : "text-fd-red"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
