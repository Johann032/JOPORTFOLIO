import Image from "next/image"
import { cn } from "@/lib/utils"
import { MermaidDiagram } from "./mermaid"
import React from "react"

export const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn("mt-2 scroll-m-20 text-4xl font-bold tracking-tight text-white", className)} {...props} />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn("mt-10 scroll-m-20 border-b border-[#2A2A2A] pb-1 text-2xl font-semibold tracking-tight text-white first:mt-0", className)} {...props} />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("mt-8 scroll-m-20 text-xl font-semibold tracking-tight text-[#E5E5E5]", className)} {...props} />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("leading-7 text-[#A6A6A6] [&:not(:first-child)]:mt-6", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2 text-[#A6A6A6]", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal [&>li]:mt-2 text-[#A6A6A6]", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li className={cn("text-[#A6A6A6]", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote className={cn("mt-6 border-l-2 border-[#E5E5E5] pl-6 italic text-[#D9D9D9]", className)} {...props} />
  ),
  img: ({ className, alt, src, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      className={cn("rounded-md border border-[#2A2A2A] my-8 max-w-full h-auto", className)} 
      alt={alt} 
      src={src}
      {...props} 
    />
  ),
  hr: ({ ...props }) => <hr className="my-8 border-[#2A2A2A]" {...props} />,
  
  // Code Blocks from rehype-pretty-code
  figure: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <figure className={cn("my-6 overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#080808]", className)} {...props} />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className={cn("overflow-x-auto p-4 py-4 text-[13px] leading-relaxed", className)} {...props} />
  ),
  // Intercept raw code blocks for Mermaid before rehype-pretty-code hits them if needed, or inline code
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isMermaid = className?.includes("language-mermaid")
    if (isMermaid && typeof children === "string") {
      return <MermaidDiagram chart={children} />
    }
    return (
      <code 
        className={cn("relative rounded bg-[#1A1A1A] px-[0.3rem] py-[0.2rem] font-mono text-sm text-[#E5E5E5]", className)} 
        {...props}
      >
        {children}
      </code>
    )
  }
}
