import { useState } from "react";
import { Search, Tag, X, Scan, Sparkles } from "lucide-react";

interface BarcodeManualDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBarcode: (barcode: string) => void;
}

const SAMPLE_BARCODES = [
  { label: "Nutella Hazelnut Spread", code: "301762042203" },
  { label: "Amul Taaza Milk", code: "8901058000000" },
  { label: "Quaker Rolled Oats", code: "8901491101820" },
  { label: "Britannia NutriChoice", code: "8901063141125" },
  { label: "Lay's Salted Chips", code: "8901491000826" },
  { label: "Maggi 2-Min Noodles", code: "8901058852302" },
  { label: "Parle-G Biscuits", code: "8901262010052" },
];

export function BarcodeManualDialog({
  isOpen,
  onClose,
  onSubmitBarcode,
}: BarcodeManualDialogProps) {
  const [code, setCode] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.trim()) {
      onSubmitBarcode(code.trim());
      setCode("");
      onClose();
    }
  };

  const handleSelectSample = (sampleCode: string) => {
    onSubmitBarcode(sampleCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 text-foreground">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Manual Barcode Entry</h3>
              <p className="text-xs text-muted-foreground">
                Type or paste EAN-13, EAN-8, or UPC code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. 301762042203 or 8901058000000"
              className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-3 text-sm font-mono font-medium outline-none focus:border-primary transition"
            />
          </div>

          <button
            type="submit"
            disabled={!code.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.35)] hover:opacity-95 disabled:opacity-50 transition active:scale-[0.98]"
          >
            <Scan className="h-4 w-4" /> Fetch Product Details
          </button>
        </form>

        <div className="space-y-2.5 pt-2 border-t border-border/60">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Test with Sample Barcodes:
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            {SAMPLE_BARCODES.map((item) => (
              <button
                key={item.code}
                onClick={() => handleSelectSample(item.code)}
                className="rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition flex items-center gap-1.5"
              >
                <Tag className="h-3 w-3 text-muted-foreground" />
                <span>{item.label}</span>
                <span className="text-[10px] text-muted-foreground font-mono">({item.code})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
