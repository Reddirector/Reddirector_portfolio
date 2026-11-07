import { useState } from 'react'

const LATENT_SAMPLES = [
  { id: 'f-104', label: 'Python Syntax Tokenizer', activation: 0.94, firing: true },
  { id: 'f-382', label: 'HTTP Protocol Headers', activation: 0.88, firing: true },
  { id: 'f-891', label: 'Diffie-Hellman Key Curve', activation: 0.76, firing: true },
  { id: 'f-1402', label: 'POSIX Socket FD State', activation: 0.82, firing: true },
  { id: 'f-2210', label: 'Memory Buffer Boundary', activation: 0.91, firing: true },
  { id: 'f-3409', label: 'Null Pointer Guard', activation: 0.0, firing: false },
]

export default function SaeVisual() {
  const [lambdaLevel, setLambdaLevel] = useState(1) // 0: 0.25, 1: 1.0, 2: 4.0

  const lambdaConfigs = [
    { label: 'λ = 0.25', sparse: 22, recon: 92, activeCount: '3,194 / 4,096', note: 'Dense regime: high reconstruction, polysemantic latents.' },
    { label: 'λ = 1.00', sparse: 58, recon: 89, activeCount: '1,720 / 4,096', note: 'Optimal regime: Anthropic reproduction baseline (0.897562 cosine sim).' },
    { label: 'λ = 4.00', sparse: 90, recon: 48, activeCount: '410 / 4,096', note: 'Ultra-sparse: few active features, dictionary starts dropping syntax.' },
  ]

  const current = lambdaConfigs[lambdaLevel]

  return (
    <div className="flex flex-col h-full rounded-lg border border-white/10 bg-zinc-950 p-4 sm:p-5 font-mono text-xs">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-[0.68rem] uppercase tracking-widest text-white/70">
            SPARSE AUTOENCODER INTERPRETABILITY
          </span>
        </div>
        <div className="text-[0.62rem] text-purple-300 font-bold bg-purple-950/50 border border-purple-500/30 px-2 py-0.5 rounded">
          GELU-1L · 2,048 → 4,096
        </div>
      </div>

      {/* Interactive Controls & Latent Bars */}
      <div className="my-auto py-4 space-y-4">
        {/* Lambda Regimes Switcher */}
        <div className="flex items-center justify-between">
          <span className="text-[0.68rem] text-white/50">L1 SPARSITY PENALTY:</span>
          <div className="flex items-center gap-1.5">
            {lambdaConfigs.map((cfg, idx) => (
              <button
                key={cfg.label}
                type="button"
                onClick={() => setLambdaLevel(idx)}
                className={`px-2 py-1 rounded text-[0.65rem] transition-colors ${
                  lambdaLevel === idx
                    ? 'bg-purple-600 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                    : 'bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Meters */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-white/5 bg-black/40 p-2.5">
            <div className="flex justify-between text-[0.62rem] text-white/60 mb-1">
              <span>COSINE SIMILARITY</span>
              <strong className="text-emerald-400">0.897562</strong>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${current.recon}%` }}
              />
            </div>
          </div>

          <div className="rounded border border-white/5 bg-black/40 p-2.5">
            <div className="flex justify-between text-[0.62rem] text-white/60 mb-1">
              <span>DEAD FEATURES</span>
              <strong className="text-purple-300">0.10%</strong>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-400 transition-all duration-500"
                style={{ width: `${current.sparse}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sample Latent Activations */}
        <div className="space-y-1.5 rounded border border-white/5 bg-black/50 p-2.5">
          <span className="text-[0.58rem] uppercase tracking-wider text-white/40 block mb-1">
            ACTIVE MONOSEMANTIC FEATURES (SAMPLES)
          </span>
          {LATENT_SAMPLES.map((feat) => {
            const isAlive = feat.firing && (lambdaLevel < 2 || feat.activation > 0.85)
            return (
              <div key={feat.id} className="flex items-center justify-between text-[0.62rem]">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${isAlive ? 'bg-purple-400' : 'bg-white/20'}`} />
                  <span className="text-white/60 font-semibold">{feat.id}</span>
                  <span className="text-white/80">{feat.label}</span>
                </div>
                <span className={isAlive ? 'text-emerald-400 font-bold' : 'text-white/30'}>
                  {isAlive ? feat.activation.toFixed(2) : '0.00'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Proof Strip */}
      <div className="border-t border-white/[0.08] pt-3 flex items-center justify-between text-[0.62rem] text-white/40">
        <span>ANTHROPIC METHODOLOGY REPRODUCTION</span>
        <span className="text-purple-400 font-bold">{current.activeCount} ACTIVE</span>
      </div>
    </div>
  )
}
