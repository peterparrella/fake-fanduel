import { useAppState } from "../lib/AppState";

export default function AccountPage({ onSettings }) {
  const { balance, startingBalance, unitSize, stats } = useAppState();

  return (
    <div className="px-4 py-4 space-y-4">
      <h1 className="text-white font-bold text-xl">Account</h1>

      <div className="rounded-2xl bg-fd-card border border-fd-border p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-fd-blue flex items-center justify-center text-white font-bold text-lg">
          U
        </div>
        <div>
          <p className="text-white font-semibold">Local Player</p>
          <p className="text-fd-gray text-xs">Personal use only · No real money</p>
        </div>
      </div>

      <div className="rounded-2xl bg-fd-card border border-fd-border divide-y divide-fd-border">
        <Row label="Current Balance" value={`$${balance.toFixed(2)}`} />
        <Row label="Starting Balance" value={`$${startingBalance.toFixed(2)}`} />
        <Row label="Unit Size" value={`$${unitSize.toFixed(2)}`} />
        <Row label="Total Wagered" value={`$${stats.totalWagered.toFixed(2)}`} />
        <Row
          label="Total Profit/Loss"
          value={`${stats.totalProfit >= 0 ? "+" : ""}$${stats.totalProfit.toFixed(2)}`}
          positive={stats.totalProfit >= 0}
        />
        <Row label="Record" value={`${stats.wins}-${stats.losses}`} />
      </div>

      <button
        onClick={onSettings}
        className="w-full py-3 rounded-full border border-fd-blue text-fd-blue font-bold"
      >
        Open Settings
      </button>

      <p className="text-fd-gray text-[11px] text-center pt-2">
        All data is stored locally in your browser. No real money is used.
      </p>
    </div>
  );
}

function Row({ label, value, positive }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-fd-gray text-sm">{label}</span>
      <span
        className={`font-semibold text-sm ${
          positive === undefined ? "text-white" : positive ? "text-fd-green" : "text-fd-red"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
