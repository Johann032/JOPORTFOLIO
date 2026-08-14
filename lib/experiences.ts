import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"

const experiencesDir = path.join(process.cwd(), "content", "experiences")

export type GalleryImage = {
  url: string
  width: number
  height: number
  alt?: string
}

export type Highlight = {
  label: string
  value: string
}

export type Experience = {
  slug: string
  title: string
  subtitle: string
  date: string
  location: string
  organizer: string
  logo?: string
  category: string
  heroImage: string
  galleryImages: GalleryImage[]
  highlights: Highlight[]
  tags: string[]
  content: string
  contentHtml: string
}

export async function getExperiences(): Promise<Experience[]> {
  if (!fs.existsSync(experiencesDir)) {
    return []
  }

  const files = fs.readdirSync(experiencesDir).filter(file => file.endsWith('.md'))

  const experiences = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace('.md', '')
      const filePath = path.join(experiencesDir, filename)
      const fileContent = fs.readFileSync(filePath, "utf8")

      const { data, content } = matter(fileContent)
      const contentHtml = await marked.parse(content)

      return {
        slug,
        title: data.title || "Untitled",
        subtitle: data.subtitle || "",
        date: data.date || "",
        location: data.location || "",
        organizer: data.organizer || "",
        logo: data.logo || undefined,
        category: data.category || "",
        heroImage: data.heroImage || "",
        galleryImages: data.galleryImages || [],
        highlights: data.highlights || [],
        tags: data.tags || [],
        content,
        contentHtml,
      }
    })
  )

  // Sort by date descending
  return experiences.sort((a, b) => {
    if (a.date < b.date) return 1
    if (a.date > b.date) return -1
    return 0
  })
}

export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  const experiences = await getExperiences()
  return experiences.find(e => e.slug === slug) || null
}
