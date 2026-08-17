import { useState, useRef } from "react";
import { Camera, Upload, X, Sparkles, Loader2, ImagePlus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface BarcodeOcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitOcrImages: (images: string[]) => void;
}

export function BarcodeOcrModal({ isOpen, onClose, onSubmitOcrImages }: BarcodeOcrModalProps) {
  const [frontImg, setFrontImg] = useState<string | null>(null);
  const [nutritionImg, setNutritionImg] = useState<string | null>(null);
  const [ingredientImg, setIngredientImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const nutritionInputRef = useRef<HTMLInputElement>(null);
  const ingredientInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageRead = (file: File, setter: (val: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    const images = [frontImg, nutritionImg, ingredientImg].filter(Boolean) as string[];
    if (images.length === 0) {
      toast.error("Please upload at least one photo (Front package or Nutrition label)");
      return;
    }
    setLoading(true);
    onSubmitOcrImages(images);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 text-foreground max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Packaging & Label OCR</h3>
              <p className="text-xs text-muted-foreground">
                Barcode not recognized? Upload packaging photos for instant estimation
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

        <p className="text-xs text-muted-foreground leading-relaxed">
          Snap clear photos of the product front label, nutrition table, or ingredient list. Our OCR
          engine reads the exact text to generate full nutrition facts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Front Package */}
          <div
            onClick={() => frontInputRef.current?.click()}
            className="relative cursor-pointer rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 p-4 text-center transition flex flex-col items-center justify-center min-h-[120px]"
          >
            {frontImg ? (
              <div className="relative w-full h-full min-h-[90px] flex items-center justify-center">
                <img
                  src={frontImg}
                  alt="Front"
                  className="max-h-24 rounded-xl object-contain shadow-sm"
                />
                <span className="absolute top-0 right-0 bg-emerald-500 text-white rounded-full p-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <ImagePlus className="h-6 w-6 text-primary mx-auto" />
                <div className="text-xs font-bold text-foreground">1. Front Photo</div>
                <div className="text-[10px] text-muted-foreground">Product Name & Brand</div>
              </div>
            )}
            <input
              ref={frontInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleImageRead(e.target.files[0], setFrontImg)
              }
            />
          </div>

          {/* Nutrition Table */}
          <div
            onClick={() => nutritionInputRef.current?.click()}
            className="relative cursor-pointer rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 p-4 text-center transition flex flex-col items-center justify-center min-h-[120px]"
          >
            {nutritionImg ? (
              <div className="relative w-full h-full min-h-[90px] flex items-center justify-center">
                <img
                  src={nutritionImg}
                  alt="Nutrition Table"
                  className="max-h-24 rounded-xl object-contain shadow-sm"
                />
                <span className="absolute top-0 right-0 bg-emerald-500 text-white rounded-full p-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <ImagePlus className="h-6 w-6 text-primary mx-auto" />
                <div className="text-xs font-bold text-foreground">2. Nutrition Table</div>
                <div className="text-[10px] text-muted-foreground">Calories & Macros</div>
              </div>
            )}
            <input
              ref={nutritionInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleImageRead(e.target.files[0], setNutritionImg)
              }
            />
          </div>

          {/* Ingredients */}
          <div
            onClick={() => ingredientInputRef.current?.click()}
            className="relative cursor-pointer rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 p-4 text-center transition flex flex-col items-center justify-center min-h-[120px]"
          >
            {ingredientImg ? (
              <div className="relative w-full h-full min-h-[90px] flex items-center justify-center">
                <img
                  src={ingredientImg}
                  alt="Ingredients"
                  className="max-h-24 rounded-xl object-contain shadow-sm"
                />
                <span className="absolute top-0 right-0 bg-emerald-500 text-white rounded-full p-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <ImagePlus className="h-6 w-6 text-primary mx-auto" />
                <div className="text-xs font-bold text-foreground">3. Ingredients List</div>
                <div className="text-[10px] text-muted-foreground">Additives & Palm Oil</div>
              </div>
            )}
            <input
              ref={ingredientInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleImageRead(e.target.files[0], setIngredientImg)
              }
            />
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || (!frontImg && !nutritionImg && !ingredientImg)}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}{" "}
          Run Packaging OCR
        </button>
      </div>
    </div>
  );
}
