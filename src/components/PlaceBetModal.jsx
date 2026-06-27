import { useMemo, useState } from "react";
import { combineOdds, combinedDecimalFromLegs, formatAmerican } from "../lib/odds";
import { useAppState } from "../lib/AppState";

const SPORTS = ["MLB", "NFL", "NBA", "NHL", "Soccer", "NCAAF", "NCAAB", "Tennis", "Golf", "MMA/Boxing", "Other"];
const BET_TYPES = [
  { key: "moneyline", label: "Moneyline" },
  { key: "spread", label: "Spread" },
  { key: "total", label: "Total" },
  { key: "parlay", label: "Parlay" },
  { key: "sgp", label: "SGP" },
  { key: "sgpplus", label: "SGP+" },
];
const MULTI_LEG_TYPES = ["parlay", "sgp", "sgpplus"];

export default function PlaceBetModal({ onClose }) {
  const { unitSize, balance, placeBet, saveBetForLater } = useAppState();
  const [name, setName] = useState("");
  const [betType, setBetType] = useState("moneyline");
  const [sport, setSport] = useState("MLB");
  const [singleOdds, setSingleOdds] = useState("");
  const [legs, setLegs] = useState([{ description: "", odds: "" }]);
  const [wagerUnits, setWagerUnits] = useState("");
  const [error, setError] = useState("");

  const isMulti = MULTI_LEG_TYPES.includes(betType);

  const validLegs = useMemo(
    () => legs.filter((l) => l.description.trim() && l.odds !== "" && !Number.isNaN(Number(l.odds))),
    [legs]
  );

  const combinedAmerican = useMemo(() => {
    if (isMulti) {
      const oddsList = validLegs.map((l) => Number(l.odds));
      return oddsList.length ? combineOdds(oddsList) : null;
    }
    return singleOdds !== "" && !Number.isNaN(Number(singleOdds)) ? Number(singleOdds) : null;
  }, [isMulti, validLegs, singleOdds]);

  const combinedDecimal = useMemo(() => {
    if (isMulti) {
      const oddsList = validLegs.map((l) => Number(l.odds));
      return oddsList.length ? combinedDecimalFromLegs(oddsList) : 1;
    }
    if (combinedAmerican === null) return 1;
    return combinedAmerican > 0 ? combinedAmerican / 100 + 1 : 100 / Math.abs(combinedAmerican) + 1;
  }, [isMulti, validLegs, combinedAmerican]);

  const units = Number(wagerUnits) || 0;
  const wagerDollars = units * unitSize;
  const payout = wagerDollars * combinedDecimal;
  const profit = payout - wagerDollars;

  function updateLeg(i, field, value) {
    setLegs((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  }

  function addLeg() {
    setLegs((prev) => [...prev, { description: "", odds: "" }]);
  }

  function removeLeg(i) {
    setLegs((prev) => prev.filter((_, idx) => idx !== i));
  }

  function buildBet() {
    return {
      name: name.trim(),
      betType,
      sport,
      legs: isMulti ? validLegs.map((l) => ({ description: l.description.trim(), odds: Number(l.odds) })) : [],
      combinedAmerican,
      combinedDecimal,
      wagerUnits: units,
    };
  }

  function validate() {
    if (!name.trim()) return "Enter a bet name.";
    if (isMulti) {
      if (validLegs.length < 2) return "Add at least 2 legs.";
    } else if (combinedAmerican === null) {
      return "Enter odds.";
    }
    if (units <= 0) return "Enter a wager amount.";
    return "";
  }

  function handlePlace() {
    const err = validate();
    if (err) return setError(err);
    if (wagerDollars > balance) return setError("Wager exceeds your balance.");
    placeBet(buildBet());
    onClose();
  }

  function handleSave() {
    const err = validate();
    if (err) return setError(err);
    saveBetForLater(buildBet());
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center">
      <div className="bg-fd-bg w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto border border-fd-border">
        <div className="sticky top-0 bg-fd-bg/95 backdrop-blur border-b border-fd-border px-4 py-3 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Place a Bet</h2>
          <button onClick={onClose} className="text-fd-gray text-2xl leading-none px-2">
            ×
          </button>
        </div>

        <div className="p-4 space-y-5">
          <div>
            <label className="text-xs text-fd-gray font-semibold uppercase">Bet Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g. "Yankees ML + Over SGP"'
              className="mt-1 w-full bg-fd-card border border-fd-border rounded-xl px-3 py-2.5 text-white placeholder:text-fd-gray/60 outline-none focus:border-fd-blue"
            />
          </div>

          <div>
            <label className="text-xs text-fd-gray font-semibold uppercase">Bet Type</label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {BET_TYPES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setBetType(t.key)}
                  className={`py-2 rounded-xl text-sm font-semibold border ${
                    betType === t.key
                      ? "bg-fd-blue text-white border-fd-blue"
                      : "bg-fd-card text-fd-gray border-fd-border"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-fd-gray font-semibold uppercase">Sport</label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="mt-1 w-full bg-fd-card border border-fd-border rounded-xl px-3 py-2.5 text-white outline-none focus:border-fd-blue"
            >
              {SPORTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {isMulti ? (
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-fd-gray font-semibold uppercase">Legs</label>
                <span className="text-xs text-fd-blue font-semibold">
                  Combined: {combinedAmerican !== null ? formatAmerican(combinedAmerican) : "—"}
                </span>
              </div>
              <div className="mt-2 space-y-2">
                {legs.map((leg, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={leg.description}
                      onChange={(e) => updateLeg(i, "description", e.target.value)}
                      placeholder='Leg description (e.g. "Spain To Reach The Final")'
                      className="flex-1 bg-fd-card border border-fd-border rounded-xl px-3 py-2.5 text-white placeholder:text-fd-gray/60 outline-none focus:border-fd-blue text-sm"
                    />
                    <input
                      value={leg.odds}
                      onChange={(e) => updateLeg(i, "odds", e.target.value)}
                      placeholder="+190"
                      inputMode="numeric"
                      className="w-20 bg-fd-card border border-fd-border rounded-xl px-2 py-2.5 text-white placeholder:text-fd-gray/60 outline-none focus:border-fd-blue text-sm text-center"
                    />
                    {legs.length > 1 && (
                      <button
                        onClick={() => removeLeg(i)}
                        className="text-fd-red text-lg px-1"
                        aria-label="Remove leg"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addLeg}
                className="mt-2 w-full py-2 rounded-xl border border-dashed border-fd-blue/50 text-fd-blue text-sm font-semibold"
              >
                + Add Leg
              </button>
            </div>
          ) : (
            <div>
              <label className="text-xs text-fd-gray font-semibold uppercase">Odds (American)</label>
              <input
                value={singleOdds}
                onChange={(e) => setSingleOdds(e.target.value)}
                placeholder="-154"
                inputMode="numeric"
                className="mt-1 w-full bg-fd-card border border-fd-border rounded-xl px-3 py-2.5 text-white placeholder:text-fd-gray/60 outline-none focus:border-fd-blue"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-fd-gray font-semibold uppercase">Wager (Units)</label>
            <input
              value={wagerUnits}
              onChange={(e) => setWagerUnits(e.target.value)}
              placeholder="1"
              inputMode="decimal"
              className="mt-1 w-full bg-fd-card border border-fd-border rounded-xl px-3 py-2.5 text-white placeholder:text-fd-gray/60 outline-none focus:border-fd-blue"
            />
            <p className="mt-1 text-sm text-fd-gray">
              = <span className="text-white font-semibold">${wagerDollars.toFixed(2)}</span>{" "}
              <span className="text-xs">(1u = ${unitSize})</span>
            </p>
          </div>

          <div className="rounded-2xl bg-fd-card border border-fd-border p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-fd-gray">Combined Odds</span>
              <span className="text-fd-blue font-bold">
                {combinedAmerican !== null ? formatAmerican(combinedAmerican) : "—"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-fd-gray">Wager</span>
              <span className="text-white font-semibold">${wagerDollars.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-fd-gray">Profit</span>
              <span className="text-fd-green font-semibold">
                +${Number.isFinite(profit) ? profit.toFixed(2) : "0.00"}
              </span>
            </div>
            <div className="flex justify-between text-base pt-2 border-t border-fd-border">
              <span className="text-white font-semibold">Projected Payout</span>
              <span className="text-fd-green font-bold">
                ${Number.isFinite(payout) ? payout.toFixed(2) : "0.00"}
              </span>
            </div>
          </div>

          {error && (
            <div className="text-fd-red text-sm font-medium bg-fd-red/10 border border-fd-red/30 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pb-2">
            <button
              onClick={handleSave}
              className="py-3 rounded-full border border-fd-blue text-fd-blue font-bold"
            >
              Save for Later
            </button>
            <button
              onClick={handlePlace}
              className="py-3 rounded-full bg-fd-blue text-white font-bold active:scale-[0.98] transition"
            >
              Confirm Bet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
