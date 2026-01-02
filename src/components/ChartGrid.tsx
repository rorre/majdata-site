import { useState } from "react"
import { getDifficultyColor } from "@/lib/chart"
import type { Chart } from "@/lib/chart"
import { ChartModal } from "./ChartModal"
import { ChartDownloadButton } from "./ChartDownloadButton"

interface ChartGridProps {
  charts: Chart[]
}

export function ChartGrid({ charts }: ChartGridProps) {
  const [selectedChart, setSelectedChart] = useState<Chart | null>(null)

  return (
    <>
      <div className="space-y-3">
        {charts.map((chart) => (
          <div
            key={chart.id}
            className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:bg-card/80 transition-colors group"
          >
            {/* Jacket Image */}
            <button
              onClick={() => setSelectedChart(chart)}
              className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-muted hover:scale-105 transition-transform"
            >
              <img
                src={chart.jacket}
                alt={chart.title}
                className="w-full h-full object-cover"
              />
            </button>

            {/* Chart Info */}
            <button
              onClick={() => setSelectedChart(chart)}
              className="flex-1 text-left min-w-0 hover:opacity-80 transition-opacity"
            >
              <h3 className="font-semibold text-foreground truncate">{chart.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{chart.artist}</p>

              {/* Difficulty Badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                {chart.difficulties.map((diff) => (
                  <div
                    key={diff.difficulty}
                    className="px-2 py-0.5 rounded text-xs font-bold text-white"
                    style={{ backgroundColor: getDifficultyColor(diff.difficulty) }}
                  >
                    {diff.difficulty === "Re:MASTER" ? "Re:★" : diff.difficulty[0]}
                    {diff.level}
                  </div>
                ))}
              </div>
            </button>

            {/* Actions */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <ChartDownloadButton chart={chart} />
            </div>
          </div>
        ))}
      </div>

      <ChartModal chart={selectedChart} onClose={() => setSelectedChart(null)} />
    </>
  )
}
