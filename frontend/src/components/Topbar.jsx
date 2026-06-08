import { Bell, ChevronDown, Coins, Menu } from 'lucide-react'

function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <button
        aria-label="Open menu"
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 lg:hidden"
        type="button"
      >
        <Menu size={22} strokeWidth={2.3} />
      </button>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex h-11 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <Coins size={16} strokeWidth={2.4} />
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-bold text-slate-400">Credits</p>
            <p className="text-sm font-extrabold text-slate-950">1200</p>
          </div>
        </div>

        <button
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
          type="button"
        >
          <Bell size={20} strokeWidth={2.3} />
          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-purple-700" />
        </button>

        <button
          className="flex h-11 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2.5 pr-3 shadow-sm transition hover:border-purple-200 hover:bg-purple-50"
          type="button"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-sm font-extrabold text-white">
            AV
          </span>
          <span className="hidden text-sm font-bold text-slate-800 sm:block">
            Aman Verma
          </span>
          <ChevronDown size={16} className="text-slate-400" strokeWidth={2.4} />
        </button>
      </div>
    </header>
  )
}

export default Topbar
