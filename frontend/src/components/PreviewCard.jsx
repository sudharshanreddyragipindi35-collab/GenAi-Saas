import { Award, Dumbbell, ShieldCheck, UserCheck, Zap } from 'lucide-react'

const features = [
  {
    title: 'Expert Trainers',
    text: 'Certified professionals to guide you.',
    icon: UserCheck,
  },
  {
    title: 'Custom Plans',
    text: 'Personalized workout and diet plans.',
    icon: Award,
  },
  {
    title: 'Premium Equipment',
    text: 'State-of-the-art gym equipment.',
    icon: ShieldCheck,
  },
]

function PreviewCard() {
  return (
    <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold tracking-normal text-slate-950">
          Preview
        </h2>
        <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-extrabold text-green-700 ring-1 ring-green-100">
          AI Generated
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 text-white">
              <Dumbbell size={18} strokeWidth={2.6} />
            </span>
            <span className="text-base font-extrabold text-slate-950">
              FitZone
            </span>
          </div>
          <nav className="hidden items-center gap-5 text-xs font-bold text-slate-500 xl:flex">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </nav>
          <button
            className="h-9 rounded-xl bg-blue-600 px-4 text-xs font-extrabold text-white transition hover:bg-blue-700"
            type="button"
          >
            Get Started
          </button>
        </div>

        <div className="grid gap-6 bg-slate-50 p-5 md:grid-cols-[1fr_220px] xl:grid-cols-[1fr_260px]">
          <div className="py-4">
            <h3 className="text-3xl font-extrabold leading-tight tracking-normal text-slate-950">
              Transform Your Body,
              <span className="block">Transform Your Life</span>
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Professional training, personalized plans, and world-class
              facilities to help you achieve your fitness goals.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="h-10 rounded-xl bg-purple-700 px-5 text-sm font-extrabold text-white transition hover:bg-purple-800"
                type="button"
              >
                Get Started
              </button>
              <button
                className="h-10 rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                type="button"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="relative min-h-56 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-slate-950 p-5">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/20" />
            <div className="absolute bottom-5 left-5 h-20 w-20 rounded-full border-[14px] border-white/25" />
            <div className="absolute right-8 bottom-10 h-24 w-12 rounded-full bg-white/20" />
            <div className="absolute left-8 top-8 h-24 w-24 rounded-3xl bg-white/20 backdrop-blur" />
            <div className="relative z-10 flex h-full items-end">
              <div className="w-full rounded-2xl bg-white/15 p-4 backdrop-blur">
                <div className="mb-3 h-3 w-24 rounded-full bg-white/80" />
                <div className="grid grid-cols-3 gap-2">
                  <span className="h-12 rounded-xl bg-white/30" />
                  <span className="h-16 rounded-xl bg-white/40" />
                  <span className="h-10 self-end rounded-xl bg-white/25" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-5 py-6">
          <h3 className="text-lg font-extrabold tracking-normal text-slate-950">
            Why Choose FitZone?
          </h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  key={feature.title}
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                    <Icon size={19} strokeWidth={2.5} />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-950">
                    {feature.title}
                  </h4>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {feature.text}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-purple-50 px-4 py-3 text-sm text-slate-700">
            <Zap
              size={18}
              className="shrink-0 text-purple-700"
              strokeWidth={2.5}
            />
            <span>
              Your website will be ready in less than{' '}
              <strong className="font-extrabold text-purple-700">
                60 seconds!
              </strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PreviewCard
