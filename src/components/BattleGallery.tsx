import { useState } from "react";
import { Download } from "lucide-react";
import { useAdminState } from "@/lib/admin-store";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function BattleGallery({ battleId }: { battleId: string }) {
  const { gallery } = useAdminState();
  const images = gallery[battleId] ?? [];
  const [openImageId, setOpenImageId] = useState<string | null>(null);
  const activeImage = images.find((img) => img.id === openImageId) ?? null;

  if (images.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 mt-16">
      <div className="text-[10px] uppercase tracking-[0.4em] text-accent mb-3">Gallery</div>
      <h2 className="font-display text-2xl mb-6">Images</h2>
      <div className="-mx-6 px-6 overflow-x-auto">
        <ul className="flex gap-4 pb-3 snap-x snap-mandatory">
          {images.map((img) => (
            <li
              key={img.id}
              className="shrink-0 snap-start cursor-pointer"
              onClick={() => setOpenImageId(img.id)}
            >
              <figure className="w-[320px] sm:w-[420px]">
                <img
                  src={img.url}
                  alt=""
                  loading="lazy"
                  className="h-[240px] sm:h-[300px] w-full object-cover rounded-sm border border-border/50"
                />
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={!!activeImage} onOpenChange={(open) => !open && setOpenImageId(null)}>
        <DialogContent className="max-w-4xl w-[90vw] p-0 overflow-hidden border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">Image preview</DialogTitle>
          <DialogDescription className="sr-only">
            Expanded view of gallery image
          </DialogDescription>
          {activeImage && (
            <div className="relative">
              <img
                src={activeImage.url}
                alt=""
                className="w-full max-h-[80vh] object-contain rounded-sm"
              />
              <a
                href={activeImage.url}
                download
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-sm bg-background/90 px-3 py-2 text-xs font-medium text-foreground shadow hover:bg-background transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
