/** The illustrated tower (same drawing as the original tower.js). Render inside an <svg viewBox="0 0 300 640">. */
export function TowerGraphic({ hue = 208, floors = 16, uid }: { hue?: number; floors?: number; uid: string }) {
  const top = 40
  const fh = (640 - top - 20) / floors
  const a = `${uid}a`
  const b = `${uid}b`
  const rows = Array.from({ length: floors }, (_, i) => {
    const y = top + 14 * (1 - i / floors) + i * fh + fh * 0.55
    return (
      <g key={i}>
        <rect x={50} y={y - 4} width={200} height={7} rx={3.5} fill={`url(#${b})`} />
        <path d={`M250 ${y - 4} q22 4 32 8 v-2 q-10-8-32-8z`} fill="#d7a96f" />
        <rect x={64} y={y + 5} width={172} height={fh - 12} fill="#fff" opacity={i % 3 === 0 ? 0.22 : 0.1} />
      </g>
    )
  })
  return (
    <>
      <defs>
        <linearGradient id={a} x1="0" x2="1">
          <stop offset="0" stopColor="#2e4f7c" /><stop offset="0.5" stopColor="#8fb8e0" /><stop offset="1" stopColor="#3a5d8d" />
        </linearGradient>
        <linearGradient id={b} x1="0" x2="1">
          <stop offset="0" stopColor="#c9965f" /><stop offset="0.5" stopColor="#f3d9a8" /><stop offset="1" stopColor="#b17f4c" />
        </linearGradient>
      </defs>
      <g style={{ filter: `hue-rotate(${hue - 208}deg)` }}>
        <path d={`M60 ${top} L240 ${top + 14} L240 620 L60 620Z`} fill={`url(#${a})`} />
        <path d={`M240 ${top + 14} L282 ${top + 34} L282 620 L240 620Z`} fill="#26446e" opacity={0.9} />
        {rows}
      </g>
    </>
  )
}

export function Tower({ hue, floors, uid, id }: { hue?: number; floors?: number; uid: string; id?: string }) {
  return (
    <svg id={id} viewBox="0 0 300 640" aria-hidden="true">
      <TowerGraphic hue={hue} floors={floors} uid={uid} />
    </svg>
  )
}
