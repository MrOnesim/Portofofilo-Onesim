import type { CSSProperties } from "react";
import { MEDIA_DIMS, MEDIA_LQIP, MEDIA_VARIANTS, mediaKeyFor } from "@/data/media";
import { cn } from "@/utils/cn";

type OgImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Force le chargement immédiat même pour une image hors écran (modale). */
  eager?: boolean;
  style?: CSSProperties;
};

/**
 * Image responsive : AVIF si disponible, sinon WebP, sinon JPEG.
 * Dimensions intrinsèques pour éviter le CLS, miniature 24px en fond
 * pendant le chargement, et une seule image prioritaire par page.
 */
export function OgImage({
  src,
  alt,
  className,
  sizes = "(min-width: 980px) 50vw, 100vw",
  priority = false,
  eager = false,
  style,
}: OgImageProps) {
  const key = mediaKeyFor(src);
  const variants = key ? MEDIA_VARIANTS[key] : [];
  const dims = key ? MEDIA_DIMS[key] : { width: 960, height: 600 };
  const placeholder = key ? MEDIA_LQIP[key] : undefined;

  const avifSet = variants.map((v) => `${v.avif} ${v.width}w`).join(", ");
  const webpSet = variants.map((v) => `${v.webp} ${v.width}w`).join(", ");

  return (
    <picture className="og-img">
      {variants.length > 0 && (
        <>
          <source type="image/avif" srcSet={avifSet} sizes={sizes} />
          <source type="image/webp" srcSet={webpSet} sizes={sizes} />
        </>
      )}
      <img
        src={src}
        alt={alt}
        width={dims.width}
        height={dims.height}
        loading={priority || eager ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={cn("og-img-el", className)}
        style={{
          ...(placeholder
            ? { backgroundImage: `url(${placeholder})`, backgroundSize: "cover", backgroundPosition: "center" }
            : {}),
          ...style,
        }}
      />
    </picture>
  );
}
