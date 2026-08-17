import { useState } from "react";
import { useSyncStatus, processSyncQueue } from "@/lib/sync-manager";
import { Wifi, WifiOff, RefreshCw, Database } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function NetworkStatusBadge() {
  const status = useSyncStatus();
  const [manualSyncing, setManualSyncing] = useState(false);

  const handleManualSync = async () => {
    if (!status.isOnline || status.isSyncing || manualSyncing) return;
    setManualSyncing(true);
    await processSyncQueue();
    setManualSyncing(false);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleManualSync}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all shadow-xs border ${
              !status.isOnline
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                : status.pendingCount > 0 || status.isSyncing
                  ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 animate-pulse"
                  : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
            }`}
          >
            {!status.isOnline ? (
              <>
                <WifiOff className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">Offline Mode (SQLite)</span>
                <span className="sm:hidden">Offline</span>
              </>
            ) : status.isSyncing || manualSyncing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                <span>Syncing ({status.pendingCount})</span>
              </>
            ) : status.pendingCount > 0 ? (
              <>
                <Database className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>{status.pendingCount} Pending Sync</span>
              </>
            ) : (
              <>
                <Wifi className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Online (Synced)</span>
                <span className="sm:hidden">Synced</span>
              </>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs max-w-xs">
          {!status.isOnline ? (
            <p>
              <strong>Offline Mode Active</strong>
              <br />
              All meals, nutrition logs & water are saved instantly in your local SQLite database.
              They will automatically upload when reconnected.
            </p>
          ) : status.pendingCount > 0 ? (
            <p>
              <strong>{status.pendingCount} Local Changes</strong>
              <br />
              Click to sync local SQLite changes with the cloud now.
            </p>
          ) : (
            <p>
              <strong>Offline-First SQLite Architecture Active</strong>
              <br />
              All screens load instantly from local SQLite storage without network delay.
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
