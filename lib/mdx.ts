import fs from "fs"
import path from "path"
import { parse, format } from "date-fns"

const contentDir = path.join(process.cwd(), "content")

export type ProjectFrontmatter = {
  title: string
  description: string
  progress?: number
}

export type JournalEntry = {
  slug: string
  title: string
  date: string
  formattedDate: string
  readingTime: string
  content: string
}

function parseProjectFile(slug: string) {
  const filePath = path.join(contentDir, "projects", `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const fileContent = fs.readFileSync(filePath, "utf8")
  const chunks = fileContent.split(/\n---\n/)

  const overviewChunk = chunks[0]
  const journalChunks = chunks.slice(1)

  // Parse Overview
  let title = "Untitled Project"
  const titleMatch = overviewChunk.match(/^#\s+(.+)$/m)
  if (titleMatch) {
    title = titleMatch[1].trim()
  }

  let progress: number | undefined = undefined
  const progressMatch = overviewChunk.match(/^Progress:\s*(\d+)%/m)
  if (progressMatch) {
    progress = parseInt(progressMatch[1], 10)
  }

  // Remove Title and Progress from description
  let description = overviewChunk
    .replace(/^#\s+.+$/m, "")
    .replace(/^Progress:\s*\d+%/m, "")
    .trim()

  // Parse Journals
  const journals: JournalEntry[] = []
  
  for (let i = 0; i < journalChunks.length; i++) {
    const chunk = journalChunks[i].trim()
    if (!chunk) continue

    let entryDate = "Unknown Date"
    let entryTitle = "Untitled Entry"
    let rawDateString = "1970-01-01" // fallback for sorting

    const dateMatch = chunk.match(/^##\s+(.+)$/m)
    if (dateMatch) {
      entryDate = dateMatch[1].trim()
      try {
        const parsedDate = parse(entryDate, "d MMMM yyyy", new Date())
        rawDateString = format(parsedDate, "yyyy-MM-dd")
      } catch (e) {
        rawDateString = entryDate // fallback
      }
    }

    const entryTitleMatch = chunk.match(/^###\s+(.+)$/m)
    if (entryTitleMatch) {
      entryTitle = entryTitleMatch[1].trim()
    }

    // Remove Date and Title from content
    let content = chunk
      .replace(/^##\s+.+$/m, "")
      .replace(/^###\s+.+$/m, "")
      .trim()

    const wordCount = content.split(/\s+/).length
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))
    const readingTime = `${readingTimeMinutes} min read`

    journals.push({
      slug: `${slug}-entry-${i}`,
      title: entryTitle,
      date: rawDateString,
      formattedDate: entryDate,
      readingTime,
      content
    })
  }

  // Sort journals newest first
  journals.sort((a, b) => {
    if (a.date > b.date) return -1
    if (a.date < b.date) return 1
    return 0
  })

  return {
    overview: {
      frontmatter: { title, description, progress } as ProjectFrontmatter,
      content: description,
    },
    journals
  }
}

export async function getProjectOverview(slug: string) {
  const data = parseProjectFile(slug)
  return data ? data.overview : null
}

export async function getProjectJournals(slug: string): Promise<JournalEntry[]> {
  const data = parseProjectFile(slug)
  return data ? data.journals : []
}

export async function getAllJournalDates(slug: string): Promise<string[]> {
  const journals = await getProjectJournals(slug)
  return journals.map((entry) => entry.date)
}

export async function getProjects() {
  const projectsDir = path.join(contentDir, "projects")
  if (!fs.existsSync(projectsDir)) return []
  
  const files = fs.readdirSync(projectsDir, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
    .map(dirent => dirent.name)

  const projects = []
  for (const filename of files) {
    const slug = filename.replace('.md', '')
    const data = parseProjectFile(slug)
    if (data && data.overview) {
      projects.push({
        slug,
        ...data.overview.frontmatter,
        latestJournal: data.journals[0] || null,
        journalCount: data.journals.length
      })
    }
  }
  return projects
}
