export default function ClassicListPreview() {
  return (
    <div className="space-y-1.5">
      <div className="border-border bg-muted/30 flex items-center gap-2 rounded-md border p-2">
        <div className="bg-primary/30 h-6 w-6 rounded-md" />
        <div className="flex-1 space-y-1">
          <div className="bg-foreground/20 h-2 w-16 rounded-md" />
          <div className="bg-muted-foreground/30 h-1.5 w-12 rounded-md" />
        </div>
        <div className="bg-primary/60 h-5 w-12 rounded-md" />
      </div>
      <div className="border-border bg-muted/30 flex items-center gap-2 rounded-md border p-2">
        <div className="bg-primary/20 h-6 w-6 rounded-md" />
        <div className="flex-1 space-y-1">
          <div className="bg-foreground/20 h-2 w-14 rounded-md" />
          <div className="bg-muted-foreground/30 h-1.5 w-10 rounded-md" />
        </div>
        <div className="bg-primary/40 h-5 w-12 rounded-md" />
      </div>
    </div>
  );
}
