import fs from "fs"
import path from "path"
import { parseISO, format } from "date-fns"

const contentDir = path.join(process.cwd(), "content")

export type ProjectFrontmatter = {
  title: string
  description: string
  status: string
  progress: number
}

export type JournalEntry = {
  slug: string
  title: string
  date: string
  formattedDate: string
  readingTime: string
  content: string
}

export async function getProjectOverview(slug: string) {
  const filePath = path.join(contentDir, "projects", slug, "project.mdx")
  if (!fs.existsSync(filePath)) return null

  const fileContent = fs.readFileSync(filePath, "utf8")
  // Keep frontmatter for project.mdx since it holds overall project stats (progress/status)
  // We can just parse it manually or regex it if we want to drop gray-matter completely, but 
  // keeping the gray-matter import just for the overview is okay, or we can regex it to be pure.
  // The user said "Do NOT use MDX. Do NOT use frontmatter." for the Journal, but for the 
  // overview we might need it unless we parse that too. To be absolutely pure:
  
  // Quick regex parser for frontmatter
  let title = "Untitled Project"
  let description = ""
  let status = "Active"
  let progress = 0
  let content = fileContent

  const match = fileContent.match(/^---\n([\s\S]*?)\n---/)
  if (match) {
    const fm = match[1]
    const titleMatch = fm.match(/title:\s*"([^"]+)"/)
    if (titleMatch) title = titleMatch[1]
    
    const descMatch = fm.match(/description:\s*"([^"]+)"/)
    if (descMatch) description = descMatch[1]
    
    const statusMatch = fm.match(/status:\s*"([^"]+)"/)
    if (statusMatch) status = statusMatch[1]
    
    const progressMatch = fm.match(/progress:\s*(\d+)/)
    if (progressMatch) progress = parseInt(progressMatch[1], 10)
    
    content = fileContent.replace(/^---\n[\s\S]*?\n---/, "").trim()
  }

  return {
    frontmatter: { title, description, status, progress } as ProjectFrontmatter,
    content,
  }
}

export async function getProjectJournals(slug: string): Promise<JournalEntry[]> {
  const journalDir = path.join(contentDir, "projects", slug, "journal")
  if (!fs.existsSync(journalDir)) return []

  const files = fs.readdirSync(journalDir, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".md"))
    .map((dirent) => dirent.name)

  const entries: JournalEntry[] = files.map((filename) => {
    const filePath = path.join(journalDir, filename)
    let fileContent = fs.readFileSync(filePath, "utf8")
    
    // Parse Date from filename (YYYY-MM-DD-...)
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/)
    const rawDate = dateMatch ? dateMatch[1] : "1970-01-01"
    const formattedDate = dateMatch ? format(parseISO(rawDate), "d MMMM yyyy") : "Unknown Date"

    // Parse Title from first H1
    let title = filename.replace(".md", "")
    const h1Match = fileContent.match(/^#\s+(.+)$/m)
    if (h1Match) {
      title = h1Match[1].trim()
      // Remove the first H1 from the content so it doesn't duplicate in the UI
      fileContent = fileContent.replace(h1Match[0], "").trim()
    }

    // Calculate Reading Time (assume 200 words per minute)
    const wordCount = fileContent.split(/\s+/).length
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))
    const readingTime = `${readingTimeMinutes} min read`

    return {
      slug: filename.replace(".md", ""),
      title,
      date: rawDate,
      formattedDate,
      readingTime,
      content: fileContent,
    }
  })

  // Sort newest first by string comparison of raw date (YYYY-MM-DD)
  return entries.sort((a, b) => {
    if (a.date > b.date) return -1
    if (a.date < b.date) return 1
    // If same date, sort alphabetically backwards to keep predictable
    return a.slug > b.slug ? -1 : 1
  })
}

export async function getAllJournalDates(slug: string): Promise<string[]> {
  const journals = await getProjectJournals(slug)
  return journals.map((entry) => entry.date)
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
