import fs from "fs"
import path from "path"
import matter from "gray-matter"

const contentDir = path.join(process.cwd(), "content")

export type ProjectFrontmatter = {
  title: string
  description: string
  status: string
  progress: number
}

export type JournalFrontmatter = {
  title: string
  date: string
  version?: string
  progress?: number
  status?: string
  timeSpent?: string
  tags?: string[]
}

export type JournalEntry = {
  slug: string
  folder: string
  frontmatter: JournalFrontmatter
  content: string
}

export async function getProjectOverview(slug: string) {
  const filePath = path.join(contentDir, "projects", slug, "project.mdx")
  if (!fs.existsSync(filePath)) return null

  const fileContent = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContent)

  return {
    frontmatter: data as ProjectFrontmatter,
    content,
  }
}

export async function getProjectJournals(slug: string): Promise<JournalEntry[]> {
  const journalDir = path.join(contentDir, "projects", slug, "journal")
  if (!fs.existsSync(journalDir)) return []

  const folders = fs.readdirSync(journalDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  const entries: JournalEntry[] = folders.map((folder) => {
    const filePath = path.join(journalDir, folder, "entry.mdx")
    if (!fs.existsSync(filePath)) return null

    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContent)

    if (!data.title || !data.date) {
      console.warn(`[MDX Warning] Missing required fields 'title' or 'date' in ${filePath}`);
    }
    
    // gray-matter parses YYYY-MM-DD into a Date object automatically
    let dateStr = "1970-01-01"
    if (data.date) {
      dateStr = data.date instanceof Date ? data.date.toISOString().split("T")[0] : String(data.date)
    }

    return {
      slug: folder,
      folder, // useful to resolve images
      frontmatter: {
        title: data.title || "Untitled Entry",
        date: dateStr,
        version: data.version,
        progress: data.progress,
        status: data.status,
        timeSpent: data.timeSpent,
        tags: data.tags
      } as JournalFrontmatter,
      content,
    }
  }).filter((entry): entry is JournalEntry => entry !== null)

  // Sort newest first
  return entries.sort((a, b) => {
    if (a.frontmatter.date > b.frontmatter.date) return -1
    if (a.frontmatter.date < b.frontmatter.date) return 1
    return 0
  })
}

export async function getAllJournalDates(slug: string): Promise<string[]> {
  const journals = await getProjectJournals(slug)
  return journals.map((entry) => entry.frontmatter.date)
}

export async function getProjects() {
  const projectsDir = path.join(contentDir, "projects")
  if (!fs.existsSync(projectsDir)) return []
  
  const slugs = fs.readdirSync(projectsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  const projects = []
  for (const slug of slugs) {
    const overview = await getProjectOverview(slug)
    const journals = await getProjectJournals(slug)
    if (overview) {
      projects.push({
        slug,
        ...overview.frontmatter,
        latestJournal: journals[0] || null,
        journalCount: journals.length
      })
    }
  }
  return projects
}
