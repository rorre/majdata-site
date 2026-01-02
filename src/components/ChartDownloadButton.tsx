import { useState } from "react"
import type { Chart } from "@/lib/chart"
import { Button } from "@/components/ui/button"
import { Download, ChevronDown } from "lucide-react"
import { downloadChartAsAdx } from "@/lib/download"

interface ChartDownloadButtonProps {
  chart: Chart
  showWithoutMv?: boolean
}

export function ChartDownloadButton({ chart, showWithoutMv = false }: ChartDownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const hasMv = !!chart.mv_link
  const hasFiles = !!(chart.audio_link || chart.chart_link)

  if (!hasFiles) {
    return null
  }

  const handleDownload = (includeMv: boolean = true) => {
    downloadChartAsAdx(chart.artist, chart.title, {
      mv: includeMv ? chart.mv_link : undefined,
      jacket: chart.jacket,
      audio: chart.audio_link,
      chart: chart.chart_link,
    })
    setIsOpen(false)
  }

  if (!hasMv || !showWithoutMv) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleDownload(true)}
        className="gap-1"
      >
        <Download size={16} />
        Download
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-1"
      >
        <Download size={16} />
        Download
        <ChevronDown size={16} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-10">
          <button
            onClick={() => handleDownload(true)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-md"
          >
            Download with MV
          </button>
          <button
            onClick={() => handleDownload(false)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors last:rounded-b-md"
          >
            Download without MV
          </button>
        </div>
      )}
    </div>
  )
}
