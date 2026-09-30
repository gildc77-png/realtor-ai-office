const autonomyLevels = [
  {
    level: "Level 1",
    title: "Prepare",
    description:
      "Chispita prepares the work and the realtor executes it with direct control.",
  },
  {
    level: "Level 2",
    title: "Prepare + Approve",
    description:
      "Chispita drafts and requests review before acting on the realtor's behalf.",
  },
  {
    level: "Level 3",
    title: "Autopilot",
    description:
      "Chispita executes according to permissioned rules and clear approval policies.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.24),transparent_40%),linear-gradient(180deg,#020817_0%,#0f172a_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 lg:px-12">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-sky-950/30 backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-sky-200">
                Foundation
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Realtor AI Office
              </h1>
              <p className="mt-4 text-lg text-slate-300">
                AI Virtual Assistant for Real Estate Professionals
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200">
              Autonomous by Default. Human by Exception.
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {autonomyLevels.map((item) => (
              <div
                key={item.level}
                className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                  {item.level}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 border-t border-slate-700 pt-8 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                Current status
              </h3>
              <p className="mt-2 text-base text-slate-200">Foundation phase only</p>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                Scope
              </h3>
              <p className="mt-2 text-base text-slate-200">
                Architecture, security baseline, and future-ready domain structure
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                Explicitly deferred
              </h3>
              <p className="mt-2 text-base text-slate-200">
                MLS integrations, external publishing, and autonomous workflows are not implemented yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
