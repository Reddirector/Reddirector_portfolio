import { useState, useEffect } from 'react'

const DAG_NODES = [
  { id: 'ingest', name: '01. INGEST', type: 'root', time: '12 µs' },
  { id: 'plan', name: '02. AGENTIC PLAN', type: 'agent', time: '148 µs' },
  { id: 'reflect', name: '03. REFLECTION LOOP', type: 'loop', time: '312 µs' },
  { id: 'spool', name: '04. DISK SPOOL O(1)', type: 'io', time: '84 µs' },
  { id: 'commit', name: '05. CDC REPLICATION', type: 'wal', time: '71 µs' },
]

export default function OrchestrationVisual() {
  const [activeStep, setActiveStep] = useState(2)
  const [running, setRunning] = useState(true)
  const [workerCount, setWorkerCount] = useState(8)
  const [simState, setSimState] = useState('NORMAL')

  useEffect(() => {
    if (!running) return undefined
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % DAG_NODES.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [running])

  const triggerRollbackSim = () => {
    setSimState('SAGA_ROLLBACK')
    setActiveStep(2)
    setTimeout(() => {
      setSimState('COMPENSATED')
      setTimeout(() => setSimState('NORMAL'), 2500)
    }, 2000)
  }

  return (
    <div className="flex flex-col h-full rounded-lg border border-white/10 bg-zinc-950 p-4 sm:p-5 font-mono text-xs">
      {/* Visual Top Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[0.68rem] uppercase tracking-widest text-white/70">
            CYCLIC DAG WORK-STEALING RUNTIME
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[0.62rem] text-white/40">STATUS:</span>
          <span className={`px-1.5 py-0.5 rounded text-[0.62rem] font-bold ${
            simState === 'NORMAL' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' :
            simState === 'SAGA_ROLLBACK' ? 'bg-red-950/80 text-red-400 border border-red-500/50 animate-pulse' :
            'bg-amber-950/60 text-amber-300 border border-amber-500/30'
          }`}>
            {simState}
          </span>
        </div>
      </div>

      {/* Interactive DAG Pipeline Graph */}
      <div className="my-auto py-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {DAG_NODES.map((node, index) => {
            const isActive = activeStep === index
            const isDone = index < activeStep
            const isRollback = simState === 'SAGA_ROLLBACK' && index === 2
            return (
              <div
                key={node.id}
                onClick={() => {
                  setActiveStep(index)
                  setRunning(false)
                }}
                className={`relative flex flex-col justify-between rounded border p-2.5 transition-all duration-300 cursor-pointer ${
                  isRollback
                    ? 'border-red-500 bg-red-950/40 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                    : isActive
                    ? 'border-emerald-400 bg-emerald-950/30 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.02]'
                    : isDone
                    ? 'border-white/20 bg-white/[0.03] text-white/80'
                    : 'border-white/5 bg-transparent text-white/40 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-[0.62rem]">
                  <span className="font-bold">{node.id.toUpperCase()}</span>
                  <span className="text-[0.58rem] opacity-70">{node.time}</span>
                </div>
                <div className="my-2 text-[0.72rem] font-semibold text-white/90">
                  {node.name}
                </div>
                <div className="flex items-center gap-1.5 text-[0.58rem]">
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    isRollback ? 'bg-red-500 animate-ping' :
                    isActive ? 'bg-emerald-400 animate-ping' :
                    isDone ? 'bg-emerald-400' : 'bg-white/20'
                  }`} />
                  <span className="uppercase text-white/50">
                    {isRollback ? 'ROLLING BACK' : isActive ? 'EXECUTING' : isDone ? 'VERIFIED' : 'PENDING'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Work-stealing workers status line */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded bg-black/60 border border-white/5 px-3 py-2 text-[0.65rem] text-white/60">
          <div className="flex items-center gap-3">
            <span>ACTIVE WORKERS: <strong className="text-white">{workerCount}</strong></span>
            <span>THROUGHPUT: <strong className="text-emerald-400">44,730 w/s</strong></span>
            <span>OVERHEAD: <strong className="text-cyan-400">627 µs/task</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRunning(!running)}
              className="text-white/80 hover:text-white underline decoration-white/40"
            >
              {running ? 'PAUSE' : 'RESUME'}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={triggerRollbackSim}
              className="text-red-400 hover:text-red-300 font-semibold"
            >
              TRIGGER SAGA ROLLBACK ⚡
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Proof Strip */}
      <div className="border-t border-white/[0.08] pt-3 flex items-center justify-between text-[0.62rem] text-white/40">
        <span>STDLIB ONLY · ZERO REDIS · ZERO CELERY</span>
        <span className="text-emerald-400/80 font-bold">301 / 301 PASSING (92.35% COV)</span>
      </div>
    </div>
  )
}
