import { MDXRemote } from "next-mdx-remote/rsc"
import { components } from "./mdx-components"
import remarkGfm from "remark-gfm"
import rehypePrettyCode from "rehype-pretty-code"

interface CustomMDXProps {
  source: string
  folder?: string
  projectSlug?: string
}

export function CustomMDX({ source, folder, projectSlug }: CustomMDXProps) {
  // Pre-process image paths to route through our API
  let processedSource = source
  if (folder && projectSlug) {
    const basePath = `/api/content-media/projects/${projectSlug}/journal/${folder}/`
    processedSource = processedSource.replace(/src=".\/([^"]+)"/g, `src="${basePath}$1"`)
    processedSource = processedSource.replace(/!\[([^\]]*)\]\(\.\/([^\)]+)\)/g, `![$1](${basePath}$2)`)
  }

  return (
    <MDXRemote 
      source={processedSource} 
      components={components} 
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            [rehypePrettyCode, { theme: "github-dark-dimmed" }]
          ],
        }
      }}
    />
  )
}
