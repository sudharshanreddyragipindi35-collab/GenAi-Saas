import { Check, Plus } from 'lucide-react'

const colors = [
  { label: 'Blue', value: 'bg-blue-600', selected: true },
  { label: 'Purple', value: 'bg-purple-700' },
  { label: 'Cyan', value: 'bg-cyan-500' },
  { label: 'Green', value: 'bg-green-500' },
  { label: 'Red', value: 'bg-red-500' },
]

function ColorSelector() {
  return (
    <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
      {colors.map((color) => (
        <button
          aria-label={color.label}
          className={`flex h-8 w-8 items-center justify-center rounded-full ${color.value} ring-offset-2 transition hover:scale-105 ${
            color.selected ? 'ring-2 ring-blue-600' : ''
          }`}
          key={color.label}
          type="button"
        >
          {color.selected && (
            <Check size={16} className="text-white" strokeWidth={3} />
          )}
        </button>
      ))}
      <button
        aria-label="Add color"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 transition hover:border-purple-300 hover:text-purple-700"
        type="button"
      >
        <Plus size={18} strokeWidth={2.4} />
      </button>
    </div>
  )
}

export default ColorSelector
