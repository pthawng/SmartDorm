interface PropertyGalleryProps {
  images: string[];
}

/**
 * PropertyGallery — row of thumbnail images with hover scale.
 */
export function PropertyGallery({ images }: PropertyGalleryProps) {
  if (images.length === 0) return null;

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {images.map((src, i) => (
        <div
          key={i}
          className="group h-32 overflow-hidden rounded-xl border border-slate-200 shadow-sm cursor-pointer sm:h-40"
        >
          <img
            src={src}
            alt={`Gallery ${i + 1}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
