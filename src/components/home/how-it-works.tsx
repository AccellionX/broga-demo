const STEPS = [
  {
    n: "01",
    title: "Pick a venue",
    body: "Find a village hall near you. Filter by day, time or trial courses starting soon.",
  },
  {
    n: "02",
    title: "Start a 5-week trial",
    body: "Same teacher, same crew, every week. The easiest way to actually stick with it.",
  },
  {
    n: "03",
    title: "Stay on as a member",
    body: "Like it? Go unlimited across all venues. Cancel anytime, no awkward sales pitch.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
          How it works
        </h2>
        <p className="mt-2 max-w-lg text-charcoal/70">
          Three steps. No commitment gymnastics.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="rounded-xl border border-forest-100 bg-white p-6 shadow-sm"
            >
              <span className="text-sm font-bold text-accent">{step.n}</span>
              <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-charcoal/70">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
