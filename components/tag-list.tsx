export default function TagList() {
  const tags = [
    { name: "GoPay", count: 4 },
    { name: "Kretya Studio", count: 2 },
    { name: "Content Dump", count: 21 },
  ]

  return (
    <div>
      <h3 className="mb-2 px-3 text-sm font-medium">Your own tags</h3>
      <div className="space-y-1">
        {tags.map((tag, i) => (
          <a key={i} href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            <span className="flex-1">{tag.name}</span>
            <span className="text-muted-foreground">{tag.count}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

