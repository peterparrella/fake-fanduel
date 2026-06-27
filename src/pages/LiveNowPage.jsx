import { useAppState } from "../lib/AppState";
import BetCard from "../components/BetCard";
import { Pill } from "../components/Pill";

export default function LiveNowPage({ onMarkWin, onMarkLoss, onLegToggle }) {
  const { bets } = useAppState();
  const open = bets.filter((b) => b.status === "open");

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-white font-bold text-xl">Live Now</h1>
        <Pill color="solidRed">● LIVE</Pill>
      </div>
      {open.length === 0 ? (
        <p className="text-fd-gray text-sm text-center py-10">No open bets in play.</p>
      ) : (
        <div className="space-y-3">
          {open.map((bet) => (
            <BetCard
              key={bet.id}
              bet={bet}
              onMarkWin={onMarkWin}
              onMarkLoss={onMarkLoss}
              onLegToggle={onLegToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
