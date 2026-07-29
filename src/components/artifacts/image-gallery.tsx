'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ImageGallery({ urls }: { urls: string[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const images = urls.filter(
    (u) => u.startsWith('/uploads/') || /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(u)
  )
  const links = urls.filter((u) => !images.includes(u))

  function prev() {
    setLightbox((i) => (i === null ? 0 : (i - 1 + images.length) % images.length))
  }
  function next() {
    setLightbox((i) => (i === null ? 0 : (i + 1) % images.length))
  }
  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'Escape') setLightbox(null)
  }

  return (
    <>
      {/* Thumbnail grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-night-801 hover:border-lipu-500/40 transition-colors text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Referencia ${i + 1}`} className="w-full object-cover max-h-48" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* External links */}
      {links.map((url, i) => (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:underline truncate"
        >
          {url}
        </a>
      ))}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
          onKeyDown={handleKey}
          tabIndex={0}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          {images.length > 1 && (
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-white/70 bg-black/40 px-3 py-1 rounded-full">
              {lightbox + 1} / {images.length}
            </span>
          )}

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image */}
          <div onClick={(e) => e.stopPropagation()} className="max-w-5xl max-h-[85vh] px-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightbox]}
              alt={`Referencia ${lightbox + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </>
  )
}
