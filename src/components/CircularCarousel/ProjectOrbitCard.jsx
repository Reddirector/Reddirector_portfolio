import React from 'react'

export function ProjectOrbitCard({ project, index, isActive, onOpenDetails }) {
  if (!project) return null

  const is01 = project.id === '01'
  const is02 = project.id === '02'
  const is03 = project.id === '03'
  const is04 = project.id === '04'

  return (
    <div
      className={`project-orbit-card group select-none flex flex-col justify-between w-full h-full p-3 relative overflow-hidden transition-all duration-300 ${
        isActive ? 'project-orbit-card--active' : ''
      }`}
      style={{
        background: 'linear-gradient(180deg, #161113 0%, #0E0A0C 60%, #070405 100%)',
        borderRadius: 'var(--cc-radius, 12px)',
        border: isActive
          ? '1px solid #E5484D'
          : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isActive
          ? '0 0 25px rgba(229, 72, 77, 0.35), inset 0 0 15px rgba(229, 72, 77, 0.12)'
          : '0 8px 24px rgba(0, 0, 0, 0.6)',
      }}
      title="Double-click or click action to open full case study"
    >
      {/* Top accent light bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
        style={{
          background: isActive
            ? 'linear-gradient(90deg, transparent, #E5484D, #ff7176, #E5484D, transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        }}
      />

      {/* Header Row */}
      <div className="flex items-center justify-between gap-1 w-full shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/10">
            {project.id}
          </span>
          <span
            className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider ${
              isActive ? 'text-[#E5484D]' : 'text-white/60'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? 'bg-[#E5484D] animate-ping' : 'bg-white/40'
              }`}
            />
            {is01 && '0-DEP DAG'}
            {is02 && 'COS 0.897'}
            {is03 && 'BYOK RAG'}
            {is04 && 'LOSSLESS'}
          </span>
        </div>

        <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
          {is01 && 'PY 3.10+'}
          {is02 && 'MECH-INTERP'}
          {is03 && 'SECURITY'}
          {is04 && 'DART 3.5'}
        </span>
      </div>

      {/* Micro-Visualization Graphic (height 94px) */}
      <div className="relative w-full h-[94px] my-1 rounded-md bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center shrink-0">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '12px 12px',
          }}
        />

        {/* Project 01: Orchestration Engine Reflection DAG */}
        {is01 && (
          <svg
            className="w-full h-full p-1"
            viewBox="0 0 190 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Connection curved lines */}
            <path
              d="M 32 42 C 60 20, 80 20, 95 42 C 110 64, 130 64, 158 42"
              stroke="#E5484D"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="animate-pulse"
              opacity="0.8"
            />
            <path
              d="M 95 42 C 105 18, 55 18, 95 42"
              stroke="#ff7176"
              strokeWidth="1.2"
              opacity="0.9"
            />

            {/* Nodes */}
            {/* Node 1: StateGraph */}
            <g transform="translate(14, 28)">
              <rect
                width="36"
                height="28"
                rx="4"
                fill="#181013"
                stroke="#E5484D"
                strokeWidth="1"
              />
              <text x="18" y="14" fill="#fff" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">GRAPH</text>
              <text x="18" y="22" fill="#E5484D" fontSize="5.5" fontFamily="monospace" textAnchor="middle">Cyclic</text>
            </g>

            {/* Node 2: Saga Rollback */}
            <g transform="translate(77, 28)">
              <rect
                width="36"
                height="28"
                rx="4"
                fill="#181013"
                stroke={isActive ? '#E5484D' : '#666'}
                strokeWidth="1"
              />
              <text x="18" y="14" fill="#fff" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SAGA</text>
              <text x="18" y="22" fill="#ff7176" fontSize="5.5" fontFamily="monospace" textAnchor="middle">Rollback</text>
            </g>

            {/* Node 3: SQLite O(1) Stream */}
            <g transform="translate(140, 28)">
              <rect
                width="36"
                height="28"
                rx="4"
                fill="#181013"
                stroke="#E5484D"
                strokeWidth="1"
              />
              <text x="18" y="14" fill="#fff" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STREAM</text>
              <text x="18" y="22" fill="#E5484D" fontSize="5.5" fontFamily="monospace" textAnchor="middle">O(1) WAL</text>
            </g>

            {/* Footer metric strip in SVG */}
            <text x="95" y="74" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="monospace" textAnchor="middle">
              233/233 Tests · 44.7k writes/s
            </text>
          </svg>
        )}

        {/* Project 02: SAE Reproduction Latent Space */}
        {is02 && (
          <svg
            className="w-full h-full p-1"
            viewBox="0 0 190 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Input layer 2048 */}
            <g transform="translate(18, 12)">
              <text x="10" y="8" fill="rgba(255,255,255,0.6)" fontSize="6" fontFamily="monospace">IN: 2048</text>
              <circle cx="14" cy="20" r="3" fill="#E5484D" opacity="0.8" />
              <circle cx="14" cy="32" r="3" fill="#fff" opacity="0.9" />
              <circle cx="14" cy="44" r="3" fill="#E5484D" opacity="0.8" />
              <circle cx="14" cy="56" r="3" fill="#fff" opacity="0.5" />
            </g>

            {/* Expansion lines */}
            <line x1="36" y1="32" x2="80" y2="20" stroke="rgba(229,72,77,0.5)" strokeWidth="1" />
            <line x1="36" y1="44" x2="80" y2="40" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line x1="36" y1="44" x2="80" y2="60" stroke="rgba(229,72,77,0.5)" strokeWidth="1" />
            <line x1="36" y1="56" x2="80" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

            {/* Sparse Features 4096 Matrix */}
            <g transform="translate(82, 10)">
              <rect width="88" height="54" rx="4" fill="#140F11" stroke="#E5484D" strokeWidth="0.8" />
              <text x="44" y="14" fill="#fff" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                LATENTS: 4096
              </text>
              {/* Feature dots */}
              <circle cx="22" cy="26" r="2.5" fill="#E5484D" className="animate-ping" />
              <circle cx="44" cy="26" r="2.5" fill="#fff" />
              <circle cx="66" cy="26" r="2.5" fill="#E5484D" />
              <circle cx="22" cy="38" r="2.5" fill="#fff" opacity="0.7" />
              <circle cx="44" cy="38" r="2.5" fill="#ff7176" />
              <circle cx="66" cy="38" r="2.5" fill="#444" /> {/* dead feature */}
              <text x="44" y="48" fill="#ff7176" fontSize="5.5" fontFamily="monospace" textAnchor="middle">
                0.10% Dead Features
              </text>
            </g>

            <text x="95" y="74" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="monospace" textAnchor="middle">
              Cosine Similarity: 0.897562
            </text>
          </svg>
        )}

        {/* Project 03: Pentagon Security Workstation */}
        {is03 && (
          <svg
            className="w-full h-full p-1"
            viewBox="0 0 190 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Pentagon central shield */}
            <g transform="translate(48, 8)">
              <polygon
                points="45,4 82,30 68,66 22,66 8,30"
                fill="#171012"
                stroke="#E5484D"
                strokeWidth="1.5"
              />
              <polygon
                points="45,12 74,33 63,60 27,60 16,33"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <text x="45" y="36" fill="#fff" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                BYOK
              </text>
              <text x="45" y="46" fill="#ff7176" fontSize="5.5" fontFamily="monospace" textAnchor="middle">
                FERNET
              </text>
              <text x="45" y="55" fill="rgba(255,255,255,0.6)" fontSize="4.5" fontFamily="monospace" textAnchor="middle">
                AES-128-CBC
              </text>
            </g>

            {/* Left badge */}
            <g transform="translate(6, 26)">
              <rect width="36" height="24" rx="3" fill="#140F11" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
              <text x="18" y="12" fill="#fff" fontSize="5.5" fontFamily="monospace" textAnchor="middle">LOCAL</text>
              <text x="18" y="19" fill="#E5484D" fontSize="5" fontFamily="monospace" textAnchor="middle">ChromaDB</text>
            </g>

            {/* Right badge */}
            <g transform="translate(148, 26)">
              <rect width="36" height="24" rx="3" fill="#140F11" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
              <text x="18" y="12" fill="#fff" fontSize="5.5" fontFamily="monospace" textAnchor="middle">LANGGRAPH</text>
              <text x="18" y="19" fill="#ff7176" fontSize="5" fontFamily="monospace" textAnchor="middle">6 Tiers</text>
            </g>

            <text x="95" y="78" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="monospace" textAnchor="middle">
              Zero Cloud Leakage · Web/APK/ISO
            </text>
          </svg>
        )}

        {/* Project 04: ValtSky Multiplatform Cloud Vault */}
        {is04 && (
          <svg
            className="w-full h-full p-1"
            viewBox="0 0 190 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Phone sensor */}
            <g transform="translate(12, 18)">
              <rect width="28" height="42" rx="3" fill="#181013" stroke="#E5484D" strokeWidth="1" />
              <circle cx="14" cy="10" r="3" fill="#ff7176" />
              <rect x="6" y="18" width="16" height="18" rx="1" fill="rgba(255,255,255,0.1)" />
              <text x="14" y="30" fill="#fff" fontSize="4.5" fontFamily="monospace" textAnchor="middle">RAW</text>
            </g>

            {/* Magic byte verification conduit */}
            <g transform="translate(48, 24)">
              <rect width="44" height="30" rx="3" fill="#120D0F" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
              <text x="22" y="13" fill="#fff" fontSize="5.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SQLITE WAL</text>
              <text x="22" y="22" fill="#E5484D" fontSize="5" fontFamily="monospace" textAnchor="middle">Monotonic</text>
            </g>

            {/* Connecting Stream Arrows */}
            <path
              d="M 40 39 L 48 39 M 92 39 L 102 39"
              stroke="#E5484D"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              className="animate-pulse"
            />

            {/* Telegram Gateway Cloud */}
            <g transform="translate(104, 18)">
              <rect width="74" height="42" rx="4" fill="#181013" stroke="#E5484D" strokeWidth="1" />
              <text x="37" y="15" fill="#fff" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                TELEGRAM BOT
              </text>
              <text x="37" y="25" fill="#ff7176" fontSize="5.5" fontFamily="monospace" textAnchor="middle">
                sendDocument Stream
              </text>
              <text x="37" y="35" fill="rgba(255,255,255,0.6)" fontSize="4.5" fontFamily="monospace" textAnchor="middle">
                0% Transcode · &lt;28MB Heap
              </text>
            </g>

            <text x="95" y="76" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="monospace" textAnchor="middle">
              Bit-for-Bit Preservation · 16/16 QA Tests
            </text>
          </svg>
        )}
      </div>

      {/* Title & Description Section */}
      <div className="flex flex-col justify-center flex-1 px-0.5">
        <h3 className="font-display font-black text-[13px] sm:text-[14px] leading-tight text-white tracking-tight truncate">
          {project.name}
        </h3>
        <p className="font-mono text-[8.5px] uppercase tracking-wider text-white/50 truncate mt-0.5">
          {project.tag}
        </p>
        <p className="font-serif text-[9.5px] leading-snug text-white/70 line-clamp-2 mt-1">
          {project.short}
        </p>
      </div>

      {/* Action Button: Open Case Study */}
      <div
        className="mt-1.5 shrink-0"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onOpenDetails?.(project, e)
          }}
          className={`w-full py-1.5 px-2 rounded-md font-mono text-[9.5px] font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 border ${
            isActive
              ? 'bg-[#E5484D] hover:bg-[#ff575d] text-white border-[#E5484D] shadow-md shadow-[#E5484D]/30'
              : 'bg-white/10 hover:bg-[#E5484D] text-white/90 hover:text-white border-white/15 hover:border-[#E5484D]'
          }`}
          aria-label={`Open case study for ${project.name}`}
        >
          <span>Open Case Study</span>
          <span className="text-[11px] leading-none">↗</span>
        </button>
      </div>
    </div>
  )
}
