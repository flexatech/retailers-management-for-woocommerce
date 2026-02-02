export default function ModalPopupPreview() {
  return (
    <div className="relative">
      <div className="bg-foreground/5 absolute inset-0 rounded-lg" />
      <div className="border-border bg-card relative mx-auto w-4/5 rounded-lg border p-3 shadow-lg">
        <div className="bg-foreground/20 mb-2 h-2 w-16 rounded-md" />
        <div className="space-y-1.5">
          <div className="border-border/50 flex items-center gap-2 rounded-md border p-1.5">
            <div className="bg-primary/30 h-4 w-4 rounded-md" />
            <div className="bg-foreground/15 h-2 w-10 rounded-md" />
          </div>
          <div className="border-border/50 flex items-center gap-2 rounded-md border p-1.5">
            <div className="bg-primary/20 h-4 w-4 rounded-md" />
            <div className="bg-foreground/15 h-2 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
