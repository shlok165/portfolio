/**
 * Page frame: two hairline rails that run the full height of the page along the
 * content column, like the margins of a technical drawing.
 */
export function PageFrame() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 hidden md:block">
      <div className="mx-auto h-full w-full max-w-6xl border-x border-dashed border-line-strong/70" />
    </div>
  )
}
