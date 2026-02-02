export default function StoreLocatiorPreview() {
  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <div className="from-accent/10 to-primary/10 relative h-14">
        <div className="bg-primary absolute top-2 left-3 h-3 w-3 rounded-full shadow" />
        <div className="bg-accent absolute top-5 right-6 h-3 w-3 rounded-full shadow" />
        <div className="bg-primary/70 absolute bottom-3 left-1/2 h-3 w-3 rounded-full shadow" />
      </div>
      <div className="bg-card space-y-1 p-2">
        <div className="bg-muted h-2 w-full rounded-md" />
        <div className="bg-muted h-2 w-3/4 rounded-md" />
      </div>
    </div>
  );
}
