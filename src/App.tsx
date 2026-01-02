import { useEffect, useState } from "react"
import { Hero } from "@/components/Hero"
import { ChartGrid } from "@/components/ChartGrid"
import { Toaster } from "@/components/ui/sonner"
import { loadCharts } from "@/lib/chart"
import type { Chart } from "@/lib/chart"

export function App() {
  const [charts, setCharts] = useState<Chart[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCharts().then((loadedCharts) => {
      setCharts(loadedCharts)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-background">
        <Hero />

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-neutral-600 dark:text-neutral-400">
                  Loading charts...
                </div>
              </div>
            ) : charts.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-neutral-600 dark:text-neutral-400">
                  No charts found. Add markdown files to the charts directory.
                </div>
              </div>
            ) : (
              <ChartGrid charts={charts} />
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default App
