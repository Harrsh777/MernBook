"use client";

/**
 * Fixed atmosphere behind everything:
 * - animated film grain (SVG turbulence, GPU-cheap)
 * - two slow drifting blur blobs
 * - hairline vertical guides (editorial grid)
 * All extremely subtle; pure decoration, aria-hidden.
 */
export default function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden>
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <div className="guides">
        <span /><span /><span /><span />
      </div>
      <div className="grain" />
    </div>
  );
}
