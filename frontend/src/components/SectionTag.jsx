import { X } from 'lucide-react'

function SectionTag({ label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-2 text-sm font-bold text-purple-700">
      {label}
      <button
        aria-label={`Remove ${label}`}
        className="rounded-full text-purple-400 transition hover:text-purple-700"
        type="button"
      >
        <X size={14} strokeWidth={2.6} />
      </button>
    </span>
  )
}

export default SectionTag
