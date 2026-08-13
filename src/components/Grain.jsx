// Fixed film-grain wash over the whole page. An inline SVG turbulence filter keeps
// it dependency-free and resolution-independent.
//
// Deliberately no mix-blend-mode: a blended full-viewport fixed layer forces the
// browser to re-composite the entire screen on every repaint, which showed up as
// cursor lag. Plain opacity composites on the GPU and costs nothing.
const grainSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
     <filter id="n">
       <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/>
     </filter>
     <rect width="160" height="160" filter="url(#n)" opacity="0.42"/>
   </svg>`,
);

export default function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] opacity-[0.07] dark:opacity-[0.06]"
      style={{
        backgroundImage: `url("data:image/svg+xml,${grainSvg}")`,
        // keep it on its own compositor layer so it never repaints with the page
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    />
  );
}
