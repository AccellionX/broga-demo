import { TESTIMONIALS } from "@/lib/mock-data";

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
          From the mats
        </h2>
        <p className="mt-2 text-charcoal/70">Real-sounding feedback. Sample data.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-xl border border-forest-100 bg-white p-6 shadow-sm"
            >
              <p className="text-charcoal/80">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm font-semibold text-forest-700">
                {t.name}
                <span className="font-normal text-charcoal/50">
                  {" "}
                  · {t.village}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
