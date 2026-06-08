import { Bot, Code2, Sparkles, WandSparkles } from 'lucide-react'

function HeroBanner() {
  return (
    <section className="relative min-h-[220px] overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-purple-50 to-white p-7 shadow-sm ring-1 ring-purple-100 sm:p-8">
      <div className="absolute right-16 top-8 h-32 w-32 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="absolute bottom-4 right-72 h-24 w-24 rounded-full bg-purple-400/25 blur-3xl" />
      <div className="grid min-h-[160px] items-center gap-8 lg:grid-cols-[1fr_390px]">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-4xl font-extrabold leading-tight tracking-normal text-slate-950 sm:text-5xl">
            Generate Your Website
            <span className="block bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              with AI
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-500">
            Fill in your business details and let AI create a stunning website
            for you in seconds.
          </p>
        </div>

        <div className="relative z-10 hidden h-44 lg:block">
          <div className="absolute right-0 top-0 w-60 rounded-3xl border border-white/80 bg-white/90 p-4 shadow-2xl shadow-purple-200/60 backdrop-blur">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-300" />
              <span className="h-3 w-3 rounded-full bg-yellow-300" />
              <span className="h-3 w-3 rounded-full bg-green-300" />
            </div>
            <div className="h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-4">
              <div className="h-3 w-24 rounded-full bg-white/80" />
              <div className="mt-3 h-2 w-32 rounded-full bg-white/50" />
              <div className="mt-2 h-2 w-20 rounded-full bg-white/50" />
            </div>
          </div>

          <div className="absolute bottom-0 left-4 w-44 rounded-3xl border border-white/80 bg-white p-5 shadow-2xl shadow-blue-200/60">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-700 to-blue-600 text-white">
              <Bot size={34} strokeWidth={2.2} />
            </div>
            <div className="mt-4 h-2 rounded-full bg-slate-100" />
            <div className="mt-2 h-2 w-3/4 rounded-full bg-slate-100" />
          </div>

          <div className="absolute left-40 top-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-purple-700 shadow-xl shadow-purple-200">
            <Sparkles size={22} strokeWidth={2.5} />
          </div>
          <div className="absolute bottom-6 right-64 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-xl shadow-blue-200">
            <WandSparkles size={20} strokeWidth={2.5} />
          </div>
          <div className="absolute right-16 bottom-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-purple-700 shadow-xl shadow-purple-200">
            <Code2 size={20} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
