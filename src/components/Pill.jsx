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
    <span className="relative inline-flex items-center shrink-0" style={{ height: 18 }}>
      <svg width={label === "PARLAY" ? 58 : 40} height="18" viewBox={`0 0 ${label === "PARLAY" ? 58 : 40} 18`}>
        <polygon
          points={`0,0 ${label === "PARLAY" ? 58 : 40},0 ${(label === "PARLAY" ? 58 : 40) - 6},18 0,18`}
          fill="#ffc845"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-black font-extrabold italic tracking-tight"
        style={{ fontSize: 10, paddingRight: 6 }}
      >
        {label}
      </span>
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

const MONOGRAM_COLORS = [
  "#7c3aed", "#0ea5e9", "#16a34a", "#dc2626", "#d97706", "#0891b2", "#db2777", "#4f46e5",
];

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function Monogram({ text, size = 28 }) {
  const clean = (text || "?").trim();
  const initials = clean
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";
  const color = MONOGRAM_COLORS[hashStr(clean) % MONOGRAM_COLORS.length];
  return (
    <span
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}
