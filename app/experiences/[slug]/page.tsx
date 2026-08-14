import { getExperienceBySlug, getExperiences } from "@/lib/experiences"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Calendar, MapPin, Building2, Tag } from "lucide-react"
import { PhotoGallery } from "@/components/photo-gallery"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export async function generateStaticParams() {
  const experiences = await getExperiences()
  return experiences.map((exp) => ({ slug: exp.slug }))
}

export default async function ExperiencePage({ params }: { params: { slug: string } }) {
  // Await the params before using them as required by Next.js 15+ 
  const slug = (await params).slug
  const experience = await getExperienceBySlug(slug)

  if (!experience) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-end pb-20 pt-32 px-4 sm:px-6">
        <div className="absolute inset-0 z-0">
          <img 
            src={experience.heroImage} 
            alt={experience.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full relative z-[70] pointer-events-auto">
          <a 
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono tracking-widest uppercase text-muted-foreground hover:text-white transition-colors mb-8 cursor-pointer relative z-[70]"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Portfolio
          </a>
          
          <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {experience.date}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50 hidden sm:block" />
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {experience.location}</span>
          </div>
          
          {experience.logo && (
            <div className="mb-6">
              <img src={experience.logo} alt="Organizer Logo" className="h-12 w-auto object-contain" />
            </div>
          )}
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            {experience.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-[#A6A6A6] max-w-3xl leading-relaxed">
            {experience.subtitle}
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-24 pb-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Story markdown */}
            {experience.contentHtml && (
              <div className="space-y-8">
                 <h2 className="text-3xl font-bold tracking-tight border-b border-border pb-4">My Story</h2>
                 <div 
                   className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-white hover:prose-a:text-white/80 prose-a:transition-colors prose-strong:text-white"
                   dangerouslySetInnerHTML={{ __html: experience.contentHtml }}
                 />
              </div>
            )}

            {/* Photo Gallery */}
            {experience.galleryImages && experience.galleryImages.length > 0 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold tracking-tight border-b border-border pb-4">Gallery</h2>
                <PhotoGallery images={experience.galleryImages} />
              </div>
            )}
            
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Info Card */}
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 space-y-8 sticky top-32">
              {experience.highlights && experience.highlights.length > 0 && (
                <div>
                  <h3 className="text-sm font-mono text-muted-foreground tracking-widest uppercase mb-4">Highlights</h3>
                  <div className="space-y-4">
                    {experience.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-[#2A2A2A] pb-3 last:border-0 last:pb-0">
                        <span className="text-muted-foreground">{highlight.label}</span>
                        <span className="font-medium text-white text-right">{highlight.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {experience.tags && experience.tags.length > 0 && (
                <div className="pt-4 border-t border-[#2A2A2A]">
                  <h3 className="text-sm font-mono text-muted-foreground tracking-widest uppercase flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4" /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {experience.tags.map(tag => (
                      <span 
                        key={tag}
                        className="px-3 py-1.5 rounded-full bg-[#1A1A1A] border border-[#333] text-xs font-medium text-[#A6A6A6]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
