import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "./storage";

const AppStateContext = createContext(null);

const DEFAULT_BALANCE = 1000;
const DEFAULT_UNIT = 25;

let idCounter = 0;
export function genId() {
  idCounter += 1;
  return `${Date.now()}_${idCounter}_${Math.random().toString(36).slice(2, 7)}`;
}

export function AppStateProvider({ children }) {
  const [balance, setBalance] = useLocalStorage("fd_balance", DEFAULT_BALANCE);
  const [startingBalance, setStartingBalance] = useLocalStorage(
    "fd_starting_balance",
    DEFAULT_BALANCE
  );
  const [unitSize, setUnitSize] = useLocalStorage("fd_unit_size", DEFAULT_UNIT);
  const [bets, setBets] = useLocalStorage("fd_bets", []);

  function placeBet(bet) {
    const wagerDollars = bet.wagerUnits * unitSize;
    setBalance((b) => Number((b - wagerDollars).toFixed(2)));
    setBets((prev) => [
      {
        ...bet,
        id: genId(),
        status: "open",
        savedOnly: false,
        wagerDollars,
        placedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  function saveBetForLater(bet) {
    const wagerDollars = bet.wagerUnits * unitSize;
    setBets((prev) => [
      {
        ...bet,
        id: genId(),
        status: "saved",
        savedOnly: true,
        wagerDollars,
        placedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  function activateSavedBet(id) {
    const bet = bets.find((b) => b.id === id);
    if (!bet) return;
    const wagerDollars = bet.wagerUnits * unitSize;
    setBalance((b) => Number((b - wagerDollars).toFixed(2)));
    setBets((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: "open", savedOnly: false, wagerDollars, placedAt: new Date().toISOString() }
          : b
      )
    );
  }

  function settleBet(id, result, legResults) {
    setBets((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const updated = { ...b, status: result, settledAt: new Date().toISOString() };
        if (legResults) updated.legResults = legResults;
        if (result === "win") {
          const payout = b.wagerDollars * b.combinedDecimal;
          updated.payout = Number(payout.toFixed(2));
          updated.profit = Number((payout - b.wagerDollars).toFixed(2));
          setBalance((bal) => Number((bal + payout).toFixed(2)));
        } else {
          updated.payout = 0;
          updated.profit = Number((-b.wagerDollars).toFixed(2));
        }
        return updated;
      })
    );
  }

  function toggleLegResult(id, legIndex, result) {
    setBets((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const legResults = { ...(b.legResults || {}) };
        legResults[legIndex] = legResults[legIndex] === result ? undefined : result;
        return { ...b, legResults };
      })
    );
  }

  function deleteBet(id) {
    setBets((prev) => prev.filter((b) => b.id !== id));
  }

  function resetBalance() {
    setBalance(startingBalance);
  }

  function setNewStartingBalance(amount) {
    setStartingBalance(amount);
    setBalance(amount);
  }

  function fullReset() {
    setStartingBalance(DEFAULT_BALANCE);
    setBalance(DEFAULT_BALANCE);
    setUnitSize(DEFAULT_UNIT);
    setBets([]);
  }

  function exportData() {
    const data = {
      type: "fd-bet-tracker-export",
      version: 1,
      exportedAt: new Date().toISOString(),
      balance,
      startingBalance,
      unitSize,
      bets,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `bet-tracker-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importData(data, mode = "replace") {
    if (!data || typeof data !== "object" || !Array.isArray(data.bets)) {
      throw new Error("Invalid backup file.");
    }
    if (typeof data.balance === "number") setBalance(data.balance);
    if (typeof data.startingBalance === "number") setStartingBalance(data.startingBalance);
    if (typeof data.unitSize === "number") setUnitSize(data.unitSize);
    if (mode === "merge") {
      setBets((prev) => {
        const existingIds = new Set(prev.map((b) => b.id));
        const incoming = data.bets.filter((b) => !existingIds.has(b.id));
        return [...incoming, ...prev];
      });
    } else {
      setBets(data.bets);
    }
  }

  const stats = useMemo(() => {
    const settled = bets.filter((b) => b.status === "win" || b.status === "loss");
    const wins = settled.filter((b) => b.status === "win");
    const losses = settled.filter((b) => b.status === "loss");
    const totalWagered = settled.reduce((sum, b) => sum + b.wagerDollars, 0);
    const totalProfit = settled.reduce((sum, b) => sum + (b.profit || 0), 0);
    const roi = totalWagered > 0 ? (totalProfit / totalWagered) * 100 : 0;
    return {
      totalWagered,
      totalProfit,
      roi,
      wins: wins.length,
      losses: losses.length,
    };
  }, [bets]);

  const value = {
    balance,
    startingBalance,
    unitSize,
    bets,
    stats,
    setUnitSize,
    placeBet,
    saveBetForLater,
    activateSavedBet,
    settleBet,
    toggleLegResult,
    deleteBet,
    resetBalance,
    setNewStartingBalance,
    fullReset,
    exportData,
    importData,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
