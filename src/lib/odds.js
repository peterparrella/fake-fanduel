export function americanToDecimal(odds) {
  const n = Number(odds);
  if (n > 0) return n / 100 + 1;
  return 100 / Math.abs(n) + 1;
}

export function decimalToAmerican(decimal) {
  if (decimal >= 2) return Math.round((decimal - 1) * 100);
  return Math.round(-100 / (decimal - 1));
}

export function combineOdds(americanOddsList) {
  if (!americanOddsList.length) return 0;
  const combinedDecimal = americanOddsList.reduce(
    (acc, odds) => acc * americanToDecimal(odds),
    1
  );
  return decimalToAmerican(combinedDecimal);
}

export function combinedDecimalFromLegs(americanOddsList) {
  if (!americanOddsList.length) return 1;
  return americanOddsList.reduce((acc, odds) => acc * americanToDecimal(odds), 1);
}

export function formatAmerican(odds) {
  const n = Number(odds);
  if (!Number.isFinite(n)) return "—";
  return n > 0 ? `+${n}` : `${n}`;
}

export function calcPayout(wagerDollars, americanOddsOrDecimal, isDecimal = false) {
  const decimal = isDecimal ? americanOddsOrDecimal : americanToDecimal(americanOddsOrDecimal);
  return wagerDollars * decimal;
}

export function calcProfit(wagerDollars, americanOddsOrDecimal, isDecimal = false) {
  return calcPayout(wagerDollars, americanOddsOrDecimal, isDecimal) - wagerDollars;
}

// Estimates a cash-out value for a parlay/SGP once one or more legs have a
// known result but the bet hasn't fully settled. Any single loss kills the
// parlay (dead bet, nothing to cash out). Each still-pending leg discounts
// the payout to reflect the risk that remains.
export function estimateCashout(wagerDollars, legs, legResults = {}) {
  const dead = legs.some((_, i) => legResults[i] === "loss");
  if (dead) return { eligible: false, dead: true, amount: 0 };

  const wonOdds = legs.filter((_, i) => legResults[i] === "win").map((l) => l.odds);
  if (wonOdds.length === 0) return { eligible: false, dead: false, amount: 0 };

  const pendingCount = legs.length - wonOdds.length;
  const decimal = combinedDecimalFromLegs(wonOdds) * Math.pow(0.7, pendingCount);
  return { eligible: true, dead: false, amount: wagerDollars * decimal };
}
