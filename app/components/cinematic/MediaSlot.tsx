"use client";

import Image from "next/image";

/**
 * A designed image slot. Until you drop a real photo in /public/media/,
 * it renders as an intentional-looking monochrome frame with a hatch
 * texture and a tiny tag telling you which file to add.
 *
 *   <MediaSlot label="PORTRAIT" file="portrait.jpg" />
 *   <MediaSlot src="/media/portrait.jpg" alt="Harsh" />   ← once the image exists
 */
export default function MediaSlot({
  src,
  alt = "",
  label = "IMAGE",
  file = "your-image.jpg",
  className = "",
  priority = false,
  mono = false,
}: {
  src?: string;
  alt?: string;
  label?: string;
  file?: string;
  className?: string;
  priority?: boolean;
  mono?: boolean; // grayscale treatment (discipline / travel scenes)
}) {
  return (
    <div className={`media-slot ${mono ? "media-slot--mono" : ""} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 900px) 100vw, 60vw"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <>
          <span className="media-slot-tex" aria-hidden />
          <span className="media-slot-cross" aria-hidden />
          <span className="media-slot-tag">{label}</span>
        </>
      )}
    </div>
  );
}
