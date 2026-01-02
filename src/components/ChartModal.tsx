import { getDifficultyColor } from "@/lib/chart"
import type { Chart, DifficultyName } from "@/lib/chart"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { ChartDownloadButton } from "./ChartDownloadButton"
import ReactMarkdown from "react-markdown"

interface ChartModalProps {
  chart: Chart | null
  onClose: () => void
}

export function ChartModal({ chart, onClose }: ChartModalProps) {
  const open = !!chart

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose()
    }
  }

  if (!chart) return null

  const videoId = extractYouTubeId(chart.youtube)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <div className="p-6 space-y-6">
          {/* YouTube Video */}
          {videoId && (
            <div className="aspect-video rounded-md overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={chart.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Chart Info Card */}
          <Card className="overflow-visible">
            <CardHeader>
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={chart.jacket}
                    alt={chart.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">{chart.title}</CardTitle>
                    <CardDescription className="text-lg">
                      {chart.artist}
                    </CardDescription>
                  </div>

                  {/* Difficulties */}
                  <div className="flex flex-wrap gap-2">
                    {chart.difficulties.map((diff) => (
                      <DifficultyBadge
                        key={diff.difficulty}
                        difficulty={diff.difficulty}
                        level={diff.level}
                      />
                    ))}
                  </div>

                  {/* Download Button */}
                  <div className="pt-2">
                    <ChartDownloadButton chart={chart} />
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Markdown Content */}
          {chart.content && (
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <ReactMarkdown>{chart.content}</ReactMarkdown>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface DifficultyBadgeProps {
  difficulty: string
  level: string
}

function DifficultyBadge({ difficulty, level }: DifficultyBadgeProps) {
  const bgColor = getDifficultyColor(difficulty as DifficultyName)

  return (
    <div
      className="px-3 py-1.5 rounded text-sm font-bold text-white"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex flex-col items-center">
        <span className="text-xs">{difficulty}</span>
        <span className="text-lg leading-none">{level}</span>
      </div>
    </div>
  )
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match?.[1] || null
}
