import matter from "gray-matter"

export interface Difficulty {
  difficulty: "BASIC" | "ADVANCED" | "EXPERT" | "MASTER" | "Re:MASTER"
  level: string
}

export interface ChartMetadata {
  title: string
  artist: string
  jacket: string
  youtube: string
  difficulties: Difficulty[]
  mv_link?: string
  audio_link: string
  chart_link: string
}

export interface Chart extends ChartMetadata {
  id: string
  content: string // Markdown content
}

const DIFFICULTY_COLORS: Record<Difficulty["difficulty"], string> = {
  BASIC: "#81D955",
  ADVANCED: "#F7B608",
  EXPERT: "#FE808C",
  MASTER: "#9F51DC",
  "Re:MASTER": "#DBAAFF",
}

export type DifficultyName = keyof typeof DIFFICULTY_COLORS

export function getDifficultyColor(difficulty: DifficultyName): string {
  return DIFFICULTY_COLORS[difficulty]
}

/**
 * Parse a markdown file with YAML front matter using gray-matter
 */
export function parseChart(filename: string, content: string): Chart {
  const { data, content: markdownContent } = matter(content)

  const metadata = data as unknown as ChartMetadata

  if (
    !metadata.title ||
    !metadata.artist ||
    !metadata.jacket ||
    !metadata.youtube ||
    !metadata.difficulties
  ) {
    throw new Error(`Missing required fields in chart ${filename}`)
  }

  const id = filename.replace(".md", "")

  return {
    id,
    ...metadata,
    content: markdownContent.trim(),
  }
}

/**
 * Load all charts from the public/charts directory
 */
export async function loadCharts(): Promise<Chart[]> {
  try {
    // Import all markdown files from the charts directory
    const chartModules = import.meta.glob("/src/charts/*.md", {
      query: "?raw",
      import: "default",
    })

    const charts: Chart[] = []

    for (const [path, contentPromise] of Object.entries(chartModules)) {
      const filename = path.split("/").pop()
      if (!filename) continue

      try {
        const content = await (contentPromise() as unknown as Promise<string>)
        const chart = parseChart(filename, content)
        charts.push(chart)
      } catch (error) {
        console.error(`Failed to parse chart ${filename}:`, error)
      }
    }

    return charts
  } catch (error) {
    console.error("Failed to load charts:", error)
    return []
  }
}
