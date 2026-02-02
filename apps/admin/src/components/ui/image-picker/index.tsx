import { Trash, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ImagePickerProps = {
  coverSrc?: string;
  onSelectCover: (src: string) => void;
  onRemoveCover: () => void;
  onOpenMedia?: () => void;
  onCloseMedia?: () => void;
};

export function ImagePicker({
  coverSrc,
  onSelectCover,
  onRemoveCover,
  onOpenMedia,
  onCloseMedia,
}: ImagePickerProps) {
  const handleImageUpload = () => {
    if (!window.wp?.media) return;
    onOpenMedia?.();
    const frame = window.wp.media({
      title: 'Choose an image',
      multiple: false,
      library: {
        type: 'image',
      },
    });

    frame.on('select', () => {
      const attachment = frame.state().get('selection').first().toJSON();

      const url = attachment.sizes?.full?.url ?? attachment.sizes?.medium?.url ?? attachment.url;

      onSelectCover(url);
    });

    frame.on('close', () => {
      onCloseMedia?.();
    });

    frame.open();
  };

  return (
    <div className="w-full">
      {!coverSrc ? (
        // ===== EMPTY STATE =====
        <div
          onClick={handleImageUpload}
          className="border-border hover:border-primary/50 hover:bg-muted/20 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors"
        >
          <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            Drag and drop or <span className="text-primary font-medium">browse</span>
          </p>
          <p className="text-muted-foreground mt-1 text-xs">PNG, JPG up to 2MB</p>
        </div>
      ) : (
        // ===== PREVIEW STATE =====
        <div className="group relative w-full max-w-[240px]">
          <div
            onClick={handleImageUpload}
            className="border-border hover:border-primary cursor-pointer overflow-hidden rounded-lg border"
          >
            <img src={coverSrc} alt="Selected image" className="h-full w-full object-contain p-3" />
          </div>

          {/* Hover actions */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleImageUpload();
              }}
            >
              <Upload className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveCover();
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
