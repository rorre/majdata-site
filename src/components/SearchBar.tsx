import { useState } from "react"
import Fuse from "fuse.js"
import { Input } from "@/components/ui/input"
import type { Chart } from "@/lib/chart"

interface SearchBarProps {
  charts: Chart[]
  onSearch: (filteredCharts: Chart[]) => void
}

export function SearchBar({ charts, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const fuse = new Fuse(charts, {
    keys: ["title", "artist", "additional_keywords"],
    threshold: 0.3,
    includeScore: true,
  })

  const handleSearch = (value: string) => {
    setQuery(value)

    if (!value.trim()) {
      onSearch(charts)
      return
    }

    const results = fuse.search(value)
    const filtered = results.map((result) => result.item)

    onSearch(filtered)
  }

  return (
    <div className="mb-6">
      <Input
        type="text"
        placeholder="Search by artist, title, or keywords..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full"
      />
    </div>
  )
}
