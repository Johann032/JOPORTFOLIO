"use client"

import { useState } from "react"
import PhotoAlbum from "react-photo-album"
import Lightbox from "yet-another-react-lightbox"
import Captions from "yet-another-react-lightbox/plugins/captions"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/captions.css"

type Image = {
  url: string
  width: number
  height: number
  alt?: string
}

export function PhotoGallery({ images }: { images: Image[] }) {
  const [index, setIndex] = useState(-1)

  if (!images || images.length === 0) return null

  const photos = images.map((img) => ({
    src: img.url,
    width: img.width,
    height: img.height,
    title: img.alt,
    alt: img.alt,
  }))

  return (
    <div className="w-full">
      <PhotoAlbum
        layout="masonry"
        photos={photos}
        onClick={({ index }) => setIndex(index)}
        spacing={16}
        columns={(containerWidth) => {
          if (containerWidth < 640) return 1
          if (containerWidth < 1024) return 2
          return 3
        }}
        renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
          <div 
            style={{ ...wrapperStyle, overflow: "hidden", borderRadius: "12px" }}
            className="group relative cursor-pointer"
          >
            {renderDefaultPhoto({ wrapped: true })}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-sm font-medium tracking-wide">Expand</span>
            </div>
          </div>
        )}
      />

      <Lightbox
        slides={photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Captions]}
        captions={{
          showToggle: true,
          descriptionTextAlign: "center",
        }}
      />
    </div>
  )
}
