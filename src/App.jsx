import { useState } from "react";
import { AppStateProvider, useAppState } from "./lib/AppState";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import PlaceBetModal from "./components/PlaceBetModal";
import SettingsModal from "./components/SettingsModal";
import HomePage from "./pages/HomePage";
import MyBetsPage from "./pages/MyBetsPage";
import AllSportsPage from "./pages/AllSportsPage";
import LiveNowPage from "./pages/LiveNowPage";
import AccountPage from "./pages/AccountPage";

function AppShell() {
  const { settleBet, unsettleBet, toggleLegResult, activateSavedBet, deleteBet } = useAppState();
  const [tab, setTab] = useState("home");
  const [showPlaceBet, setShowPlaceBet] = useState(false);
  const [reuseBet, setReuseBet] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  function handleReuse(bet) {
    setReuseBet(bet);
    setShowPlaceBet(true);
  }

  function closePlaceBet() {
    setShowPlaceBet(false);
    setReuseBet(null);
  }

  function handleMarkWin(id) {
    settleBet(id, "win");
  }
  function handleMarkLoss(id) {
    settleBet(id, "loss");
  }
  function handleLegToggle(id, legIndex, result) {
    toggleLegResult(id, legIndex, result);
  }

  const pageProps = {
    onPlaceBet: () => setShowPlaceBet(true),
    onMarkWin: handleMarkWin,
    onMarkLoss: handleMarkLoss,
    onLegToggle: handleLegToggle,
    onUndoSettle: unsettleBet,
    onReuse: handleReuse,
    onActivate: activateSavedBet,
    onDelete: deleteBet,
    onSettings: () => setShowSettings(true),
  };

  return (
    <div className="min-h-screen bg-fd-bg text-white">
      <Header onSettings={() => setShowSettings(true)} />
      <main className="max-w-lg mx-auto pb-24">
        {tab === "home" && <HomePage {...pageProps} />}
        {tab === "sports" && <AllSportsPage {...pageProps} />}
        {tab === "bets" && <MyBetsPage {...pageProps} />}
        {tab === "live" && <LiveNowPage {...pageProps} />}
        {tab === "account" && <AccountPage {...pageProps} />}
      </main>
      <BottomNav active={tab} onChange={setTab} />
      {showPlaceBet && <PlaceBetModal onClose={closePlaceBet} initialBet={reuseBet} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppShell />
    </AppStateProvider>
  );
}
