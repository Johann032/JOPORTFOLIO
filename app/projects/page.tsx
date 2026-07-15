import fs from "fs"
import path from "path"
import { getProjectOverview, getProjectJournals } from "@/lib/mdx"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

async function getProjects() {
  const projectsDir = path.join(process.cwd(), "content", "projects")
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

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <main className="max-w-5xl mx-auto px-6 py-24 flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold tracking-tight text-white">Engineering Notebook</h1>
          <p className="text-xl text-[#A6A6A6]">Follow the daily evolution of my active projects.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {projects.map(project => (
            <Link key={project.slug} href={`/projects/${project.slug}`}>
              <div className="group flex flex-col justify-between h-full p-8 bg-[#111111] border border-[#2A2A2A] rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#444444]">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">{project.title}</h2>
                    <ChevronRight className="w-5 h-5 text-[#A6A6A6] group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[#A6A6A6] line-clamp-2">{project.description}</p>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-[#2A2A2A] pt-6">
                  {project.latestJournal ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#E5E5E5]">Latest Entry</span>
                      <span className="text-sm text-[#A6A6A6] truncate">{project.latestJournal.frontmatter.title}</span>
                      <span className="text-xs text-[#555555] font-mono mt-1">{project.latestJournal.frontmatter.date}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-[#555555] italic">No journal entries yet.</span>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-white font-mono">{project.progress}%</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
