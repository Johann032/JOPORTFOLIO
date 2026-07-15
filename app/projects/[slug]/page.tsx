import { getProjectOverview, getProjectJournals, getAllJournalDates } from "@/lib/mdx"
import { notFound } from "next/navigation"
import { CustomMDX } from "@/components/mdx-remote"
import { Heatmap } from "@/components/heatmap"
import { JournalEntryCard } from "@/components/journal-entry"

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const overview = await getProjectOverview(params.slug)
  if (!overview) {
    notFound()
  }

  const journals = await getProjectJournals(params.slug)
  const dates = await getAllJournalDates(params.slug)

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <main className="max-w-5xl mx-auto px-6 py-24 flex flex-col gap-16">
        
        {/* Header */}
        <header className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold tracking-tight text-white">{overview.frontmatter.title}</h1>
          <p className="text-xl text-[#A6A6A6]">{overview.frontmatter.description}</p>
        </header>

        {/* Overview & Heatmap Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="prose prose-invert max-w-none p-8 bg-[#111111] border border-[#2A2A2A] rounded-xl">
            <CustomMDX source={overview.content} projectSlug={params.slug} />
          </section>

          <section className="flex flex-col gap-8">
            <Heatmap dates={dates} />
            <div className="p-6 bg-[#080808] border border-[#2A2A2A] rounded-xl flex flex-col gap-4">
              <h3 className="text-sm font-semibold tracking-wider text-[#A6A6A6] uppercase">Project Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-white">{overview.frontmatter.progress}%</span>
                  <span className="text-xs text-[#A6A6A6]">Completion</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-white">{journals.length}</span>
                  <span className="text-xs text-[#A6A6A6]">Journal Entries</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Developer Journal Timeline */}
        <section className="flex flex-col gap-8 mt-12">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <h2 className="text-3xl font-bold tracking-tight">Developer Journal</h2>
          </div>
          
          <div className="pl-2 ml-4 border-l border-[#2A2A2A] mt-4">
            {journals.length > 0 ? (
              journals.map((entry) => (
                <JournalEntryCard key={entry.slug} entry={entry} projectSlug={params.slug} />
              ))
            ) : (
              <p className="text-[#A6A6A6] pl-8">No journal entries yet.</p>
            )}
          </div>
        </section>

      </main>
    </div>
  )
}
