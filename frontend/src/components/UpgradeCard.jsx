import { Crown } from 'lucide-react'

function UpgradeCard() {
  return (
    <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-blue-50 p-5 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-purple-700 shadow-sm">
        <Crown size={20} strokeWidth={2.4} />
      </div>
      <h3 className="text-base font-bold text-slate-950">Upgrade to Pro</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Unlock premium features, more credits & custom domain.
      </p>
      <button
        className="mt-5 h-11 w-full rounded-xl bg-purple-700 px-4 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-800"
        type="button"
      >
        Upgrade Now
      </button>
    </div>
  )
}

export default UpgradeCard
