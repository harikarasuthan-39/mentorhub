import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, RefreshCw, Database } from "lucide-react";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [showRestored, setShowRestored] = useState(false);
  const [usedCache, setUsedCache] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 4000);
      return () => clearTimeout(timer);
    }

    function handleOffline() {
      setIsOnline(false);
      setShowRestored(false);
    }

    function handleCacheFallback() {
      setUsedCache(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("mentorhub:offline-fallback", handleCacheFallback);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("mentorhub:offline-fallback", handleCacheFallback);
    };
  }, []);

  const handleCheckConnection = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/health", { method: "HEAD", cache: "no-store" });
      if (res.ok) {
        setIsOnline(true);
        setShowRestored(true);
        setUsedCache(false);
        setTimeout(() => setShowRestored(false), 4000);
      } else {
        setIsOnline(false);
      }
    } catch {
      setIsOnline(false);
    } finally {
      setChecking(false);
    }
  };

  if (showRestored) {
    return (
      <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md transition-all animate-in slide-in-from-top duration-200">
        <div className="flex items-center gap-2 mx-auto">
          <Wifi size={15} className="animate-pulse" />
          <span>Connection restored — Live institutional data synchronized.</span>
        </div>
      </div>
    );
  }

  if (!isOnline || usedCache) {
    return (
      <div className="bg-amber-600 text-white px-4 py-2.5 text-xs font-medium flex flex-wrap items-center justify-between gap-2 shadow-md transition-all border-b border-amber-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-700/80 flex items-center justify-center shrink-0">
            <WifiOff size={13} className="text-white" />
          </div>
          <div>
            <span className="font-bold mr-1.5">Offline Mode:</span>
            <span>Displaying cached student and dashboard records. Modifications will sync when connectivity returns.</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden sm:flex items-center gap-1 text-[11px] bg-amber-700/60 px-2 py-1 rounded-md">
            <Database size={12} />
            <span>Local Cache Active</span>
          </div>
          <button
            onClick={handleCheckConnection}
            disabled={checking}
            className="inline-flex items-center gap-1.5 bg-white text-amber-900 hover:bg-amber-50 active:scale-95 px-2.5 py-1 rounded-md font-semibold text-xs transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={12} className={checking ? "animate-spin" : ""} />
            <span>{checking ? "Checking..." : "Check Connection"}</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
