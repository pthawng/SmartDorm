interface RoomGalleryProps {
  images: string[];
}

/**
 * RoomGallery — hero image (60%) + 2x2 grid (40%) on desktop.
 */
export function RoomGallery({ images }: RoomGalleryProps) {
  if (images.length === 0) return null;

  const [heroImage, ...gridImages] = images;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:h-[400px]">
      {/* Hero Image */}
      <div className="h-64 sm:h-full sm:w-3/5 overflow-hidden rounded-2xl border border-slate-200 shadow-sm cursor-pointer group">
        <img
          src={heroImage}
          alt="Room hero"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="eager"
        />
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:w-2/5">
        {gridImages.slice(0, 4).map((src, i) => (
          <div
            key={i}
            className="h-32 sm:h-full overflow-hidden rounded-xl border border-slate-200 shadow-sm cursor-pointer group"
          >
            <img
              src={src}
              alt={`Room gallery ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
