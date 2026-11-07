import { useState, useEffect, useRef } from 'react'

export default function ModernCommandPalette({ isOpen, onClose, onSelectAction }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  const COMMANDS = [
    { id: 'oe-work', label: 'Jump to Orchestration Engine (System 01)', group: 'Flagship Systems', action: () => { window.location.hash = '#work' } },
    { id: 'valtsky-work', label: 'Jump to ValtSky Multiplatform (System 02)', group: 'Flagship Systems', action: () => { window.location.hash = '#work' } },
    { id: 'pentagon-work', label: 'Jump to Pentagon AI Workstation (System 03)', group: 'Flagship Systems', action: () => { window.location.hash = '#work' } },
    { id: 'sae-work', label: 'Jump to SAE Reproduction (System 04)', group: 'Flagship Systems', action: () => { window.location.hash = '#work' } },
    { id: 'oe-report', label: 'Open Orchestration Engine 10-Chapter Dossier', group: 'Technical Dossiers', action: () => onSelectAction?.('dossier', 'orchestration-engine') },
    { id: 'valtsky-report', label: 'Open ValtSky System Architecture Dossier', group: 'Technical Dossiers', action: () => onSelectAction?.('dossier', 'valtsky-lossless-cloud-vault') },
    { id: 'pentagon-report', label: 'Open Pentagon Enterprise Architecture Dossier', group: 'Technical Dossiers', action: () => onSelectAction?.('dossier', 'pentagon') },
    { id: 'sae-report', label: 'Open SAE Research Reproduction Case Study', group: 'Technical Dossiers', action: () => onSelectAction?.('dossier', 'sae-reproduction') },
    { id: 'method', label: 'Jump to Systems Lab & Benchmarks', group: 'Navigation', action: () => { window.location.hash = '#method' } },
    { id: 'arsenal', label: 'Jump to Technical Arsenal & Capabilities', group: 'Navigation', action: () => { window.location.hash = '#arsenal' } },
    { id: 'contact', label: 'Jump to Contact & Transmission Terminal', group: 'Navigation', action: () => { window.location.hash = '#contact' } },
    { id: 'copy-pip', label: 'Copy CLI: pip install orchestration-engine', group: 'Quick Commands', action: () => { navigator.clipboard?.writeText('pip install orchestration-engine') } },
    { id: 'copy-adb', label: 'Copy CLI: adb install valtsky-v2.1.0-release.apk', group: 'Quick Commands', action: () => { navigator.clipboard?.writeText('adb install -r releases/valtsky-v2.1.0-release.apk') } },
    { id: 'github', label: 'Open GitHub Profile (@Reddirector)', group: 'External Links', action: () => window.open('https://github.com/Reddirector', '_blank') },
    { id: 'linkedin', label: 'Open LinkedIn Profile', group: 'External Links', action: () => window.open('https://linkedin.com/in/aditya-kumar-singh-6131b82a4', '_blank') },
    { id: 'x', label: 'Open X / Twitter (@KumarAditya6430)', group: 'External Links', action: () => window.open('https://x.com/KumarAditya6430', '_blank') },
  ]

  const filtered = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.group.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else onSelectAction?.('open-palette')
      }
      if (!isOpen) return

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action()
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filtered, selectedIndex, onClose, onSelectAction])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/20 bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Command Terminal"
      >
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-white/10 px-4 py-3 bg-black/60">
          <svg className="h-4 w-4 text-white/40 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Type a command or search architectures (e.g. 'ValtSky', 'Dossier', 'pip')..."
            className="w-full bg-transparent font-mono text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none"
          />
          <kbd className="hidden sm:inline rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.62rem] text-white/50">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-white/[0.04]">
          {filtered.length === 0 ? (
            <div className="p-6 text-center font-mono text-xs text-white/40">
              No matching commands or architectures found.
            </div>
          ) : (
            filtered.map((cmd, idx) => (
              <button
                key={cmd.id}
                type="button"
                onClick={() => {
                  cmd.action()
                  onClose()
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center justify-between rounded-md px-3.5 py-2.5 text-left font-mono text-xs transition-colors cursor-pointer ${
                  selectedIndex === idx
                    ? 'bg-red-500/20 text-white font-semibold border border-red-500/30'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[0.65rem] text-red-400 font-bold select-none">&gt;</span>
                  <span>{cmd.label}</span>
                </div>
                <span className="text-[0.6rem] text-white/40 uppercase tracking-widest">
                  {cmd.group}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Palette Footer */}
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 font-mono text-[0.62rem] text-white/40 bg-black/40">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="text-emerald-400">REDDIRECTOR HUD v2.4</span>
        </div>
      </div>
    </div>
  )
}
