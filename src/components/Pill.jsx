export function Pill({ children, color = "gray", className = "" }) {
  const colors = {
    gray: "bg-fd-card2 text-fd-gray border border-fd-border",
    blue: "bg-fd-blue/15 text-fd-blue border border-fd-blue/30",
    green: "bg-fd-green/15 text-fd-green border border-fd-green/30",
    red: "bg-fd-red/15 text-fd-red border border-fd-red/30",
    solidRed: "bg-fd-red text-white",
    solidBlue: "bg-fd-blue text-white",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}

export function BetTypeBadge({ type }) {
  const map = {
    moneyline: { label: "ML", color: "gray" },
    spread: { label: "Spread", color: "gray" },
    total: { label: "Total", color: "gray" },
    parlay: { label: "Parlay", color: "blue" },
    sgp: { label: "SGP", color: "blue" },
    sgpplus: { label: "SGP+", color: "blue" },
  };
  const cfg = map[type] || { label: type, color: "gray" };
  return <Pill color={cfg.color}>{cfg.label}</Pill>;
}
