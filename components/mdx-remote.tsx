import { MDXRemote } from "next-mdx-remote/rsc"
import { components } from "./mdx-components"
import remarkGfm from "remark-gfm"
import rehypePrettyCode from "rehype-pretty-code"

interface CustomMDXProps {
  source: string
}

export function CustomMDX({ source }: CustomMDXProps) {
  return (
    <MDXRemote 
      source={source} 
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
