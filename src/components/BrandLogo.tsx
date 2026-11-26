/**
 * Renders the official VVX Construction logo file (/brand/vvx-logo.jpg)
 * without altering the artwork: the supplied JPG is shown cropped to the
 * mark's bounding box (proportions preserved) and its white background is
 * made transparent at render time so the logo can sit on any background.
 * `tone="light"` renders the mark in white for dark/emerald backgrounds.
 * The source file itself is never modified.
 */
export default function BrandLogo({
  tone = "dark",
  className = "",
  id,
}: {
  tone?: "light" | "dark";
  className?: string;
  id: string;
}) {
  const c = tone === "light" ? 1 : 0;
  const fid = `logo-${id}`;
  return (
    <svg
      viewBox="90 198 366 104"
      className={className}
      role="img"
      aria-label="VVX Construction"
      preserveAspectRatio="xMinYMid meet"
    >
      <defs>
        <filter id={fid} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values={`0 0 0 0 ${c}  0 0 0 0 ${c}  0 0 0 0 ${c}  -0.3333 -0.3333 -0.3333 0 1`}
          />
          <feComponentTransfer>
            <feFuncA type="linear" slope="1.25" intercept="-0.08" />
          </feComponentTransfer>
        </filter>
      </defs>
      <image href="/brand/vvx-logo.jpg" x="0" y="0" width="500" height="500" filter={`url(#${fid})`} />
    </svg>
  );
}
