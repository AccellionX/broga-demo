import { Dumbbell, MapPinned, Smile } from "lucide-react";

const BENEFITS = [
  {
    icon: Smile,
    title: "Built for beginners",
    body: "Most of our lot had never done yoga. The 5-week course starts from scratch: no experience, no flexibility required.",
  },
  {
    icon: MapPinned,
    title: "Village halls near you",
    body: "Real local halls, not shiny studios. Park up, walk in, get sorted. Surrey, Hampshire and south-east London.",
  },
  {
    icon: Dumbbell,
    title: "No flexibility needed",
    body: "Tight hamstrings welcome. We work with what you've got and leave the Sanskrit at the door.",
  },
];

export function Benefits() {
  return (
    <section className="border-y border-forest-100 bg-white/60 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-3">
        {BENEFITS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl p-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-100 text-forest-700">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-charcoal">{title}</h3>
            <p className="mt-2 text-charcoal/70">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
