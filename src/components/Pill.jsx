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

const RIBBON_TYPES = new Set(["parlay", "sgp", "sgpplus"]);

export function RibbonBadge({ type }) {
  if (!RIBBON_TYPES.has(type)) return null;
  const label = type === "sgp" ? "SGP" : type === "sgpplus" ? "SGP+" : "PARLAY";
  return (
    <span
      className="relative inline-flex items-center bg-fd-gold text-black text-[10px] font-extrabold italic px-2 py-[3px] shrink-0"
      style={{ clipPath: "polygon(0 0, 100% 0, 88% 100%, 0% 100%)" }}
    >
      {label}
    </span>
  );
}

export function MarketLabel({ betType }) {
  const map = {
    moneyline: "MONEYLINE",
    spread: "SPREAD",
    total: "TOTAL",
    parlay: "PARLAY",
    sgp: "SAME GAME PARLAY",
    sgpplus: "SAME GAME PARLAY+",
  };
  return map[betType] || betType.toUpperCase();
}
