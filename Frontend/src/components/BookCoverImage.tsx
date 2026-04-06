type Props = {
  usfm: string;
  className?: string;
};

/** Decorative cover art: `/public/books/{USFM}.svg` (see `scripts/generate-book-cover-svgs.mjs`). */
export function BookCoverImage({ usfm, className = "" }: Props) {
  return (
    <img
      src={`/books/${encodeURIComponent(usfm)}.svg`}
      alt=""
      width={320}
      height={200}
      loading="lazy"
      decoding="async"
      className={`h-auto w-full object-cover ${className}`.trim()}
      aria-hidden
    />
  );
}
