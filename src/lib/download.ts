import JSZip from "jszip"
import { toast } from "sonner"

function getFileExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname
    return pathname.split(".").pop() || ""
  } catch {
    return ""
  }
}

async function downloadFile(url: string, onProgress: (progress: number) => void): Promise<Blob> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to download: ${url}`)
  }

  const contentLength = response.headers.get("content-length")
  const total = parseInt(contentLength || "0", 10)

  if (!response.body || total === 0) {
    return response.blob()
  }

  const reader = response.body.getReader()
  const chunks: BlobPart[] = []
  let downloaded = 0

  while (true) {
    const { done, value } = await reader.read()

    if (done) break

    chunks.push(value)
    downloaded += value.length

    const progress = Math.round((downloaded / total) * 100)
    onProgress(progress)
  }

  return new Blob(chunks)
}

export async function downloadChartAsAdx(
  artist: string,
  title: string,
  files: Partial<{
    mv: string
    jacket: string
    audio: string
    chart: string
  }>
): Promise<void> {
  // Use sonner's promise-based loading
  const downloadPromise = (async () => {
    const zip = new JSZip()
    let completedFiles = 0
    const fileCount = Object.values(files).filter(Boolean).length

    // Download MV
    if (files.mv) {
      try {
        const blob = await downloadFile(files.mv, () => {
          // Progress updates during individual file download
        })
        zip.file("bg.mp4", blob)
        completedFiles++
      } catch (error) {
        throw new Error("Failed to download MV: " + error)
      }
    }

    // Download jacket
    if (files.jacket) {
      try {
        const ext = getFileExtension(files.jacket)
        const filename = ext ? `bg.${ext}` : "bg.jpg"
        const blob = await downloadFile(files.jacket, () => {
          // Progress updates
        })
        zip.file(filename, blob)
        completedFiles++
      } catch (error) {
        throw new Error("Failed to download jacket: " + error)
      }
    }

    // Download audio
    if (files.audio) {
      try {
        const ext = getFileExtension(files.audio)
        const filename = ext ? `track.${ext}` : "track.mp3"
        const blob = await downloadFile(files.audio, () => {
          // Progress updates
        })
        zip.file(filename, blob)
        completedFiles++
      } catch (error) {
        throw new Error("Failed to download audio: " + error)
      }
    }

    // Download chart
    if (files.chart) {
      try {
        const blob = await downloadFile(files.chart, () => {
          // Progress updates
        })
        zip.file("maidata.txt", blob)
        completedFiles++
      } catch (error) {
        throw new Error("Failed to download chart: " + error)
      }
    }

    // Generate zip
    const zipBlob = await zip.generateAsync({ type: "blob", compression: "STORE" })

    // Download zip
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${artist} - ${title}.adx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    if (completedFiles === 0) {
      throw new Error("No files were downloaded")
    }

    return `Downloaded ${completedFiles}/${fileCount} files`
  })()

  toast.promise(downloadPromise, {
    loading: `Downloading ${artist} - ${title}...`,
    success: (message) => message,
    error: (error) => `Failed to download: ${error instanceof Error ? error.message : "Unknown error"}`,
  })
}
