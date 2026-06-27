import { useState } from "react";
import { formatAmerican } from "../lib/odds";
import { RibbonBadge, MarketLabel } from "./Pill";

const IS_MULTI_LEG = (type) => ["parlay", "sgp", "sgpplus"].includes(type);

const SPORT_ICON = {
  MLB: "⚾",
  NFL: "🏈",
  NBA: "🏀",
  NHL: "🏒",
  Soccer: "⚽",
  NCAAF: "🏈",
  NCAAB: "🏀",
  Tennis: "🎾",
  Golf: "⛳",
  "MMA/Boxing": "🥊",
};

function fmtMoney(n) {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

function fmtPlaced(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { month: "numeric", day: "numeric", year: "numeric" });
  const time = d
    .toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    .replace(" ", "")
    .toUpperCase();
  return `${date} ${time} ET`;
}

function ReuseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#1493ff" strokeWidth="1.8" />
      <path d="M12 8v8M8 12h8" stroke="#1493ff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 16V4M8 8l4-4 4 4M5 13v6a1 1 0 001 1h12a1 1 0 001-1v-6"
        stroke="#1493ff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckDot({ status }) {
  if (status === "win") {
    return (
      <span className="absolute -left-[19px] top-0.5 w-4 h-4 rounded-full bg-fd-green flex items-center justify-center">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4 10-10" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (status === "loss") {
    return (
      <span className="absolute -left-[19px] top-0.5 w-4 h-4 rounded-full bg-fd-red flex items-center justify-center">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
          <path d="M5 5l14 14M19 5L5 19" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return (
    <span className="absolute -left-[18px] top-0.5 w-3.5 h-3.5 rounded-full bg-fd-card border-2 border-fd-blue" />
  );
}

export default function BetCard({ bet, onMarkWin, onMarkLoss, onLegToggle, onActivate, onDelete }) {
  const [expanded, setExpanded] = useState(IS_MULTI_LEG(bet.betType) ? false : false);
  const isMulti = IS_MULTI_LEG(bet.betType);
  const isSettled = bet.status === "win" || bet.status === "loss";
  const isSaved = bet.status === "saved";
  const isOpen = bet.status === "open";
  const icon = SPORT_ICON[bet.sport] || "🏅";

  const legSummary = isMulti ? bet.legs.map((l) => l.description).join(", ") : "";

  return (
    <div className="bg-fd-card">
      <div className="px-4 pt-4 pb-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            {isMulti ? (
              <RibbonBadge type={bet.betType} />
            ) : (
              <span className="w-7 h-7 rounded-full bg-fd-card2 border border-fd-border flex items-center justify-center text-sm shrink-0 mt-0.5">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              <h3 className="text-fd-blue font-bold text-[16px] leading-tight truncate">
                {isMulti ? <MarketLabel betType={bet.betType} /> : bet.name}
              </h3>
              {!isMulti && (
                <p className="text-fd-gray text-[11px] font-medium uppercase tracking-wide mt-0.5">
                  {MarketLabel({ betType: bet.betType })}
                </p>
              )}
            </div>
          </div>
          <div className="text-white font-bold text-[17px] shrink-0">
            {formatAmerican(bet.combinedAmerican)}
          </div>
        </div>

        {isMulti && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="w-full flex items-start justify-between gap-2 mt-1.5 text-left"
          >
            <span className="text-fd-blue text-[13px] leading-snug">{legSummary}</span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              className={`shrink-0 mt-1 transition-transform ${expanded ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" stroke="#1493ff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {isMulti && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-fd-gray text-[11px] uppercase tracking-wide">{bet.sport}</span>
          </div>
        )}

        {isMulti && expanded && (
          <div className="mt-3 relative pl-5 border-t border-fd-border pt-3">
            <div className="absolute left-[1px] top-4 bottom-2 w-px bg-fd-border" />
            <div className="space-y-3.5">
              {bet.legs.map((leg, i) => {
                const legStatus = bet.legResults?.[i];
                return (
                  <div key={i} className="relative flex items-start justify-between gap-2">
                    <CheckDot status={legStatus} />
                    <div className="flex-1 min-w-0">
                      <p className="text-fd-blue font-bold text-sm leading-snug">{leg.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-white text-sm font-semibold">{formatAmerican(leg.odds)}</span>
                      {isOpen && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onLegToggle(bet.id, i, "win")}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              legStatus === "win"
                                ? "bg-fd-green text-black"
                                : "bg-fd-card2 text-fd-green border border-fd-green/40"
                            }`}
                          >
                            W
                          </button>
                          <button
                            onClick={() => onLegToggle(bet.id, i, "loss")}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              legStatus === "loss"
                                ? "bg-fd-red text-black"
                                : "bg-fd-card2 text-fd-red border border-fd-red/40"
                            }`}
                          >
                            L
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer wager/payout bar */}
      <div className="bg-fd-footer px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-white font-bold text-[15px]">{fmtMoney(bet.wagerDollars)}</div>
          <div className="text-fd-gray text-[10px] font-medium uppercase tracking-wide mt-0.5">
            Total Wager
          </div>
        </div>
        <div className="text-right">
          <div
            className={`font-bold text-[15px] ${
              bet.status === "loss" ? "text-white" : bet.status === "win" ? "text-fd-green" : "text-white"
            }`}
          >
            {isSettled
              ? bet.status === "win"
                ? fmtMoney(bet.payout)
                : "$0.00"
              : fmtMoney(bet.wagerDollars * bet.combinedDecimal)}
          </div>
          <div className="text-fd-gray text-[10px] font-medium uppercase tracking-wide mt-0.5">
            {isSettled ? (bet.status === "win" ? "Total Payout" : "Returned") : "Total Payout"}
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        {isOpen && (
          <>
            <div className="bg-fd-card2 text-fd-gray text-[12px] font-medium text-center rounded py-2.5">
              Cash out unavailable
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                onClick={() => onMarkWin(bet.id)}
                className="flex-1 py-2 rounded-full border border-fd-green text-fd-green font-bold text-[12px] active:bg-fd-green/10"
              >
                Mark Win
              </button>
              <button
                onClick={() => onMarkLoss(bet.id)}
                className="flex-1 py-2 rounded-full border border-fd-red text-fd-red font-bold text-[12px] active:bg-fd-red/10"
              >
                Mark Loss
              </button>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-1.5 py-2 rounded-full border border-fd-blue text-fd-blue font-bold text-[12.5px] active:bg-fd-blue/10">
                <ReuseIcon />
                Reuse selection
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 rounded-full border border-fd-blue text-fd-blue font-bold text-[12.5px] active:bg-fd-blue/10">
                <ShareIcon />
                Share bet
              </button>
            </div>
          </>
        )}

        {isSaved && (
          <button
            onClick={() => onActivate?.(bet.id)}
            className="w-full py-2.5 rounded-full bg-fd-blue text-white font-bold text-sm active:scale-[0.98] transition"
          >
            Place This Bet
          </button>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-fd-gray text-[10.5px] font-mono truncate max-w-[55%]">
            BET ID: {bet.id}
          </span>
          <div className="flex items-center gap-2">
            {isSaved && (
              <button onClick={() => onDelete?.(bet.id)} className="text-fd-red text-[10.5px] font-semibold">
                Delete
              </button>
            )}
            <span className="text-fd-gray text-[10.5px] font-medium">PLACED: {fmtPlaced(bet.placedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
