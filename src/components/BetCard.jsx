import { useState } from "react";
import { formatAmerican } from "../lib/odds";
import { BetTypeBadge } from "./Pill";

const IS_MULTI_LEG = (type) => ["parlay", "sgp", "sgpplus"].includes(type);

function fmtMoney(n) {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " · " +
    d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export default function BetCard({ bet, onMarkWin, onMarkLoss, onLegToggle, onActivate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const isMulti = IS_MULTI_LEG(bet.betType);
  const isSettled = bet.status === "win" || bet.status === "loss";
  const isSaved = bet.status === "saved";
  const accent =
    bet.status === "win"
      ? "border-fd-green/40"
      : bet.status === "loss"
      ? "border-fd-red/40"
      : "border-fd-border";

  return (
    <div className={`rounded-2xl bg-fd-card border ${accent} overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <BetTypeBadge type={bet.betType} />
              <span className="text-[11px] text-fd-gray font-medium">{bet.sport}</span>
            </div>
            <h3 className="text-white font-semibold text-[15px] leading-snug truncate">
              {bet.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <div
              className={`font-bold text-base ${
                bet.status === "loss" ? "text-fd-gray line-through" : "text-fd-green"
              }`}
            >
              {formatAmerican(bet.combinedAmerican)}
            </div>
          </div>
        </div>

        {isMulti && (
          <div className="mt-3">
            <button
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center gap-1 text-xs text-fd-blue font-semibold"
            >
              {expanded ? "Hide legs" : `View ${bet.legs.length} legs`}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                className={`transition-transform ${expanded ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" stroke="#1493ff" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </button>

            {expanded && (
              <div className="mt-3 relative pl-5">
                <div className="absolute left-[5px] top-1 bottom-1 w-px bg-fd-border" />
                <div className="space-y-3">
                  {bet.legs.map((leg, i) => {
                    const legStatus = bet.legResults?.[i];
                    return (
                      <div key={i} className="relative flex items-start justify-between gap-2">
                        <span
                          className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border-2 ${
                            legStatus === "win"
                              ? "bg-fd-green border-fd-green"
                              : legStatus === "loss"
                              ? "bg-fd-red border-fd-red"
                              : "bg-fd-card border-fd-blue"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white leading-snug">{leg.description}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-sm text-fd-blue font-semibold">
                            {formatAmerican(leg.odds)}
                          </span>
                          {legStatus === "win" && <span>✅</span>}
                          {legStatus === "loss" && <span>❌</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-fd-border">
          <div>
            <div className="text-[11px] text-fd-gray">Wager</div>
            <div className="text-white font-semibold text-sm">
              {fmtMoney(bet.wagerDollars)}{" "}
              <span className="text-fd-gray font-normal">({bet.wagerUnits}u)</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-fd-gray">
              {isSettled ? (bet.status === "win" ? "Profit" : "Returned") : "To Win"}
            </div>
            {isSettled ? (
              <div
                className={`font-bold text-sm ${
                  bet.status === "win" ? "text-fd-green" : "text-fd-red"
                }`}
              >
                {bet.status === "win" ? `+${fmtMoney(bet.profit)}` : "$0.00"}
              </div>
            ) : (
              <div className="text-fd-green font-bold text-sm">
                {fmtMoney(bet.wagerDollars * bet.combinedDecimal)}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-fd-gray">{fmtDate(bet.placedAt)}</span>
          {isSaved && (
            <button onClick={() => onDelete?.(bet.id)} className="text-[11px] text-fd-red font-semibold">
              Delete
            </button>
          )}
        </div>

        {bet.status === "open" && (
          <>
            <div className="mt-3 bg-fd-card2 text-fd-gray text-[11px] font-medium text-center rounded-lg py-2 border border-fd-border">
              Cash out unavailable
            </div>
            {isMulti && (
              <div className="mt-3 flex flex-wrap gap-2">
                {bet.legs.map((leg, i) => (
                  <div key={i} className="flex items-center gap-1 bg-fd-card2 border border-fd-border rounded-lg px-2 py-1">
                    <span className="text-[11px] text-fd-gray truncate max-w-[90px]">
                      {leg.description}
                    </span>
                    <button
                      onClick={() => onLegToggle(bet.id, i, "win")}
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        bet.legResults?.[i] === "win"
                          ? "bg-fd-green text-black"
                          : "bg-fd-bg text-fd-green border border-fd-green/40"
                      }`}
                    >
                      W
                    </button>
                    <button
                      onClick={() => onLegToggle(bet.id, i, "loss")}
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        bet.legResults?.[i] === "loss"
                          ? "bg-fd-red text-black"
                          : "bg-fd-bg text-fd-red border border-fd-red/40"
                      }`}
                    >
                      L
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => onMarkWin(bet.id)}
                className="py-2 rounded-full border border-fd-green text-fd-green font-semibold text-sm active:bg-fd-green/10"
              >
                Mark as Win
              </button>
              <button
                onClick={() => onMarkLoss(bet.id)}
                className="py-2 rounded-full border border-fd-red text-fd-red font-semibold text-sm active:bg-fd-red/10"
              >
                Mark as Loss
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button className="py-1.5 rounded-full border border-fd-blue/50 text-fd-blue font-semibold text-xs active:bg-fd-blue/10">
                Reuse selection
              </button>
              <button className="py-1.5 rounded-full border border-fd-blue/50 text-fd-blue font-semibold text-xs active:bg-fd-blue/10">
                Share bet
              </button>
            </div>
          </>
        )}

        {isSaved && (
          <button
            onClick={() => onActivate?.(bet.id)}
            className="mt-3 w-full py-2 rounded-full bg-fd-blue text-white font-semibold text-sm active:scale-[0.98] transition"
          >
            Place This Bet
          </button>
        )}
      </div>
    </div>
  );
}
