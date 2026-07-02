import { useRef, useState } from "react";
import { useAppState } from "../lib/AppState";

export default function SettingsModal({ onClose }) {
  const {
    startingBalance,
    unitSize,
    setUnitSize,
    setNewStartingBalance,
    resetBalance,
    scaleBankroll,
    fullReset,
    exportData,
    importData,
  } = useAppState();
  const [balanceInput, setBalanceInput] = useState(String(startingBalance));
  const [unitInput, setUnitInput] = useState(String(unitSize));
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmScale, setConfirmScale] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const fileInputRef = useRef(null);

  function applyBalance() {
    const v = Number(balanceInput);
    if (Number.isFinite(v) && v > 0) setNewStartingBalance(v);
  }

  function applyUnit() {
    const v = Number(unitInput);
    if (Number.isFinite(v) && v > 0) setUnitSize(v);
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        importData(data, "merge");
        setImportMsg(`Imported ${data.bets?.length ?? 0} bets successfully.`);
      } catch (err) {
        setImportMsg(`Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center">
      <div className="bg-fd-bg w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl border border-fd-border">
        <div className="border-b border-fd-border px-4 py-3 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Settings</h2>
          <button onClick={onClose} className="text-fd-gray text-2xl leading-none px-2">
            ×
          </button>
        </div>

        <div className="p-4 space-y-5">
          <div>
            <label className="text-xs text-fd-gray font-semibold uppercase">Starting Balance</label>
            <div className="mt-1.5 flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fd-gray">$</span>
                <input
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(e.target.value)}
                  inputMode="decimal"
                  className="w-full bg-fd-card border border-fd-border rounded-xl pl-7 pr-3 py-2.5 text-white outline-none focus:border-fd-blue"
                />
              </div>
              <button
                onClick={applyBalance}
                className="px-4 rounded-xl bg-fd-blue text-white font-semibold text-sm"
              >
                Set
              </button>
            </div>
            <p className="text-xs text-fd-gray mt-1">Resets your current balance to this amount.</p>
          </div>

          <div>
            <label className="text-xs text-fd-gray font-semibold uppercase">Unit Size</label>
            <div className="mt-1.5 flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fd-gray">$</span>
                <input
                  value={unitInput}
                  onChange={(e) => setUnitInput(e.target.value)}
                  inputMode="decimal"
                  className="w-full bg-fd-card border border-fd-border rounded-xl pl-7 pr-3 py-2.5 text-white outline-none focus:border-fd-blue"
                />
              </div>
              <button
                onClick={applyUnit}
                className="px-4 rounded-xl bg-fd-blue text-white font-semibold text-sm"
              >
                Set
              </button>
            </div>
            <p className="text-xs text-fd-gray mt-1">e.g. $25 = 1 unit. Used for all bet wager inputs.</p>
          </div>

          <div className="pt-2 border-t border-fd-border">
            <label className="text-xs text-fd-gray font-semibold uppercase">Sync Across Devices</label>
            <p className="text-xs text-fd-gray mt-1 mb-2">
              No login needed — export your data on one device, then import it on another to bring your
              balance and bets along.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={exportData}
                className="py-2.5 rounded-full border border-fd-blue text-fd-blue font-semibold text-sm"
              >
                Export Backup
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 rounded-full border border-fd-blue text-fd-blue font-semibold text-sm"
              >
                Import Backup
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              className="hidden"
            />
            {importMsg && <p className="text-xs text-fd-green mt-2">{importMsg}</p>}
          </div>

          <div className="pt-2 border-t border-fd-border space-y-2">
            {!confirmScale ? (
              <button
                onClick={() => setConfirmScale(true)}
                className="w-full py-2.5 rounded-full border border-fd-gold text-fd-gold font-semibold text-sm"
              >
                Scale Everything ×10 ($25u → $250u)
              </button>
            ) : (
              <div>
                <p className="text-xs text-fd-gray mb-2 text-center">
                  This multiplies your balance, unit size, and all bet amounts by 10. Cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmScale(false)}
                    className="flex-1 py-2.5 rounded-full border border-fd-border text-fd-gray font-semibold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      scaleBankroll(10);
                      setConfirmScale(false);
                      setBalanceInput(String(startingBalance * 10));
                      setUnitInput(String(unitSize * 10));
                    }}
                    className="flex-1 py-2.5 rounded-full bg-fd-gold text-black font-bold text-sm"
                  >
                    Confirm ×10
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={resetBalance}
              className="w-full py-2.5 rounded-full border border-fd-blue text-fd-blue font-semibold text-sm"
            >
              Reset Balance to Starting Amount
            </button>

            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full py-2.5 rounded-full border border-fd-red text-fd-red font-semibold text-sm"
              >
                Full Reset (Clear All Bets)
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-2.5 rounded-full border border-fd-border text-fd-gray font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    fullReset();
                    setConfirmReset(false);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-full bg-fd-red text-white font-semibold text-sm"
                >
                  Confirm Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
