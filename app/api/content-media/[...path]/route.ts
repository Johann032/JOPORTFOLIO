import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import mime from "mime" // need to install this or manually map

// simple mime mapper since we don't want to add another dependency if not strictly needed
const getMimeType = (ext: string) => {
  const map: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
  }
  return map[ext.toLowerCase()] || "application/octet-stream"
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const filePath = path.join(process.cwd(), "content", ...params.path)

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not Found", { status: 404 })
  }

  const stat = fs.statSync(filePath)
  if (!stat.isFile()) {
    return new NextResponse("Not Found", { status: 404 })
  }

  const ext = path.extname(filePath)
  const mimeType = getMimeType(ext)

  const fileStream = fs.createReadStream(filePath)

  return new NextResponse(fileStream as any, {
    headers: {
      "Content-Type": mimeType,
      "Content-Length": stat.size.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
