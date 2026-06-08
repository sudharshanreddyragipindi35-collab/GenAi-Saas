import {
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Plus,
  Sparkles,
  Users,
} from 'lucide-react'
import ColorSelector from './ColorSelector'
import SectionTag from './SectionTag'

const sectionTags = [
  'Hero',
  'About',
  'Services',
  'Pricing',
  'Testimonials',
  'Contact',
]

function BusinessForm() {
  function handleGenerate() {
    console.log('Generating website...')
  }

  return (
    <section className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
          <BriefcaseBusiness size={22} strokeWidth={2.4} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-normal text-slate-950">
            Business Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Provide some basic details about your business
          </p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Business Type
            </span>
            <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-purple-300 focus-within:ring-4 focus-within:ring-purple-100">
              <BriefcaseBusiness
                size={19}
                className="text-slate-400"
                strokeWidth={2.3}
              />
              <select
                className="min-w-0 flex-1 appearance-none bg-transparent text-sm font-semibold text-slate-800 outline-none"
                defaultValue="Fitness / Gym"
              >
                <option>Fitness / Gym</option>
                <option>Restaurant</option>
                <option>Agency</option>
                <option>Education</option>
              </select>
              <ChevronDown
                size={18}
                className="text-slate-400"
                strokeWidth={2.5}
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Company Name
            </span>
            <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-purple-300 focus-within:ring-4 focus-within:ring-purple-100">
              <Building2
                size={19}
                className="text-slate-400"
                strokeWidth={2.3}
              />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none"
                defaultValue="FitZone"
                type="text"
              />
            </div>
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Color Theme
            </span>
            <ColorSelector />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Target Audience
            </span>
            <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-purple-300 focus-within:ring-4 focus-within:ring-purple-100">
              <Users size={19} className="text-slate-400" strokeWidth={2.3} />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none"
                defaultValue="Young fitness enthusiasts"
                type="text"
              />
            </div>
          </label>
        </div>

        <div>
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Required Sections
          </span>
          <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {sectionTags.map((tag) => (
              <SectionTag key={tag} label={tag} />
            ))}
            <button
              className="inline-flex items-center gap-2 rounded-full border border-dashed border-purple-300 bg-white px-3 py-2 text-sm font-bold text-purple-700 transition hover:bg-purple-50"
              type="button"
            >
              <Plus size={15} strokeWidth={2.6} />
              Add Section
            </button>
          </div>
        </div>

        <button
          className="flex h-14 w-full items-center justify-center gap-3 rounded-[14px] bg-gradient-to-r from-purple-700 to-blue-600 px-5 text-base font-extrabold text-white shadow-xl shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-purple-200"
          onClick={handleGenerate}
          type="button"
        >
          <Sparkles size={21} strokeWidth={2.5} />
          Generate Website
        </button>
      </form>
    </section>
  )
}

export default BusinessForm
