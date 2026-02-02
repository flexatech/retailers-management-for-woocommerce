export default function CardGridPreview() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="border-border bg-card rounded-lg border p-2.5 shadow-sm">
        <div className="bg-muted mx-auto mb-1.5 h-5 w-5 rounded-lg" />
        <div className="bg-foreground/15 mb-1 h-1.5 w-full rounded" />
        <div className="bg-muted-foreground/20 mx-auto mb-2 h-1 w-2/3 rounded" />
        <div className="bg-primary/40 h-4 w-full rounded-md" />
      </div>
      <div className="border-border bg-card rounded-lg border p-2.5 shadow-sm">
        <div className="bg-muted mx-auto mb-1.5 h-5 w-5 rounded-lg" />
        <div className="bg-foreground/15 mb-1 h-1.5 w-full rounded" />
        <div className="bg-muted-foreground/20 mx-auto mb-2 h-1 w-2/3 rounded" />
        <div className="bg-primary/40 h-4 w-full rounded-md" />
      </div>
    </div>
  );
}
