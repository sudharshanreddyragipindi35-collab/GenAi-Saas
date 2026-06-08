import {
  Bot,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  LayoutTemplate,
  Settings,
  Sparkles,
  Sun,
} from 'lucide-react'
import UpgradeCard from './UpgradeCard'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'My Projects', icon: FolderKanban },
  { label: 'Templates', icon: LayoutTemplate },
  { label: 'AI Assistant', icon: Bot, badge: 'Beta' },
  { label: 'Subscription', icon: CreditCard },
  { label: 'Settings', icon: Settings },
]

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-slate-200 bg-white shadow-sm lg:flex lg:flex-col">
      <div className="flex h-[72px] items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-700 to-blue-600 text-white shadow-lg shadow-purple-200">
          <Sparkles size={22} strokeWidth={2.5} />
        </div>
        <span className="text-lg font-extrabold tracking-normal text-slate-950">
          AI Website Builder
        </span>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <a
              className={`flex h-12 items-center gap-3 rounded-2xl px-4 text-sm font-bold transition ${
                item.active
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
              }`}
              href="#dashboard"
              key={item.label}
            >
              <Icon size={20} strokeWidth={2.2} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-purple-100 px-2 py-1 text-[11px] font-extrabold text-purple-700">
                  {item.badge}
                </span>
              )}
            </a>
          )
        })}
      </nav>

      <div className="space-y-5 px-4 pb-5">
        <UpgradeCard />
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
            <Sun size={18} className="text-purple-700" strokeWidth={2.3} />
            <span>Light Mode</span>
          </div>
          <button
            aria-label="Light mode enabled"
            className="flex h-7 w-12 items-center rounded-full bg-purple-700 p-1 transition"
            type="button"
          >
            <span className="h-5 w-5 translate-x-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
