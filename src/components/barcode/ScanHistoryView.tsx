import { useState } from "react";
import { ScanHistoryItem } from "@/types/barcode";
import { BarcodeStore } from "@/lib/barcode-store";
import {
  Search,
  Star,
  Trash2,
  Calendar,
  Clock,
  Flame,
  ChevronRight,
  Award,
  History,
  AlertTriangle,
  X,
  Barcode,
} from "lucide-react";
import { toast } from "sonner";

interface ScanHistoryViewProps {
  onSelectScan: (item: ScanHistoryItem) => void;
}

export function ScanHistoryView({ onSelectScan }: ScanHistoryViewProps) {
  const [history, setHistory] = useState<ScanHistoryItem[]>(() => BarcodeStore.getHistory());
  const [search, setSearch] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = BarcodeStore.toggleFavorite(id);
    setHistory(updated);
    toast.success("Updated favorite");
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = BarcodeStore.deleteHistoryItem(id);
    setHistory(updated);
    toast.success("Scan deleted from history");
  };

  const handleClearAll = () => {
    BarcodeStore.clearHistory();
    setHistory([]);
    setShowClearConfirm(false);
    toast.success("Scan history cleared");
  };

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase()) ||
      item.barcode.includes(search);
    const matchesFav = onlyFavorites ? item.isFavorite : true;
    return matchesSearch && matchesFav;
  });

  if (history.length === 0) {
    return (
      <div className="rounded-[22px] border border-border/80 bg-card/60 backdrop-blur-xl p-8 text-center space-y-4 shadow-xl animate-in fade-in duration-300">
        <div className="grid h-16 w-16 place-items-center rounded-[20px] bg-gradient-to-br from-primary/20 via-emerald-500/10 to-teal-500/20 text-primary border border-primary/30 shadow-[0_0_25px_rgba(0,229,143,0.25)] mx-auto">
          <Barcode className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <div>
          <h3 className="font-display text-xl font-extrabold text-foreground">
            No Scan History Yet
          </h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1.5 leading-relaxed">
            Point your camera at food barcodes to build your personal scanned food history and
            health logs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Barcode className="h-4 w-4" />
          </div>
          <h3 className="font-display text-lg font-extrabold text-foreground">Scan History</h3>
          <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-xs font-mono font-bold text-primary">
            {filtered.length} items
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-1.5 rounded-[14px] border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
              onlyFavorites
                ? "bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                : "border-border/80 bg-card/80 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${onlyFavorites ? "fill-amber-400" : ""}`} /> Favorites
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="rounded-[14px] border border-border/80 bg-card/80 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all active:scale-95"
          >
            Clear History
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[22px] border border-border/80 bg-card/90 backdrop-blur-xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Clear Scan History?
                  </h3>
                  <p className="text-xs text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-xl p-2 text-muted-foreground hover:bg-muted transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete all {history.length} scanned products from
              your local history?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted active:scale-95 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-600 active:scale-95 transition"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear All History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search scans by product name, brand or barcode..."
          className="w-full rounded-[18px] border border-border/80 bg-card/60 backdrop-blur-xl pl-10 pr-4 py-3 text-xs font-medium outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all"
        />
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const dateObj = new Date(item.scannedAt);
          const dateStr = dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" });
          const timeStr = dateObj.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={item.id}
              onClick={() => onSelectScan(item)}
              className="group cursor-pointer rounded-[22px] border border-border/80 bg-card/60 backdrop-blur-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-[0_10px_25px_-5px_rgba(0,229,143,0.15)] active:scale-[0.98] flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="h-12 w-12 rounded-[16px] object-cover bg-muted border border-border/60 shrink-0"
                  />
                ) : (
                  <div className="grid h-12 w-12 place-items-center rounded-[16px] bg-gradient-to-br from-primary/20 to-teal-500/10 text-primary font-extrabold text-xs border border-primary/20 shrink-0">
                    <Barcode className="h-6 w-6" />
                  </div>
                )}

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary truncate">
                      {item.brand || "Brand"}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                      #{item.barcode}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {item.productName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-primary" /> {dateStr}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {timeStr}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Flame className="h-3 w-3 text-amber-500" /> {item.caloriesPerServing} kcal
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary shadow-[0_0_10px_rgba(0,229,143,0.15)]">
                  <Award className="h-3.5 w-3.5 text-primary" /> Grade {item.healthGrade}
                </span>

                <button
                  onClick={(e) => handleToggleFavorite(e, item.id)}
                  className="rounded-xl p-2 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-400 transition"
                >
                  <Star
                    className={`h-4 w-4 ${item.isFavorite ? "fill-amber-400 text-amber-400" : ""}`}
                  />
                </button>

                <button
                  onClick={(e) => handleDelete(e, item.id)}
                  className="rounded-xl p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
