import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Car,
  Backpack,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import {
  getVenueBySlug,
  getTeacher,
  getCoursesForVenue,
  VENUES,
} from "@/lib/mock-data";
import { formatGBP } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function generateStaticParams() {
  return VENUES.map((v) => ({ slug: v.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const venue = getVenueBySlug(params.slug);
  return {
    title: venue ? `${venue.name} · Bro-ga` : "Venue · Bro-ga",
  };
}

export default function VenuePage({ params }: { params: { slug: string } }) {
  const venue = getVenueBySlug(params.slug);
  if (!venue) notFound();

  const teacher = getTeacher(venue.teacherId);
  const courses = getCoursesForVenue(venue.id);
  const trial = courses.find((c) => c.type === "trial");
  const ongoing = courses.find((c) => c.type === "ongoing");

  const trialFilled = trial
    ? Math.round(((trial.capacity - trial.spacesLeft) / trial.capacity) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Photo placeholder */}
      <div
        className="relative flex h-48 items-end rounded-2xl p-6 sm:h-64"
        style={{
          background: `linear-gradient(135deg, ${venue.photoColor} 0%, #1B4332 100%)`,
        }}
      >
        <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-60" />
        <div className="relative">
          <Badge className="mb-2 bg-white/20 text-white backdrop-blur">
            {venue.region}
          </Badge>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            {venue.name}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-white/85">
            <MapPin className="h-4 w-4" />
            {venue.address}, {venue.town}, {venue.postcode}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Notes */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Car className="h-4 w-4 text-forest-600" /> Parking
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-charcoal/70">
                {venue.parking}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Backpack className="h-4 w-4 text-forest-600" /> What to bring
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-charcoal/70">
                {venue.whatToBring}
              </CardContent>
            </Card>
          </div>

          {/* Timetable */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly timetable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 rounded-xl bg-forest-50 px-4 py-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-700 text-white">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">
                    Every {venue.dayOfWeek}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-charcoal/70">
                    <Clock className="h-3.5 w-3.5" />
                    {venue.time} · {venue.timeSlot} · capacity {venue.capacity}
                  </p>
                </div>
              </div>
              {ongoing && (
                <p className="mt-3 text-sm text-charcoal/60">
                  Drop-ins welcome when spaces allow ·{" "}
                  {ongoing.spacesLeft} spaces this week
                </p>
              )}
            </CardContent>
          </Card>

          {/* Trial course */}
          {trial && (
            <Card className="border-accent/30">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="accent" className="mb-2">
                      Start here
                    </Badge>
                    <CardTitle>{trial.name}</CardTitle>
                  </div>
                  <p className="text-2xl font-extrabold text-forest-800">
                    {formatGBP(trial.pricePence)}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-charcoal/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-forest-600" />
                    Starts{" "}
                    {new Date(trial.startDate).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-forest-600" />
                    {trial.dayOfWeek}s {trial.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-forest-600" />
                    {trial.spacesLeft} of {trial.capacity} spaces left
                  </span>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-charcoal/50">
                    <span>Filling up</span>
                    <span>{trialFilled}% booked</span>
                  </div>
                  <Progress value={trialFilled} />
                </div>
                <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
                  <Link href={`/book/${trial.id}`}>Book this course</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Teacher */}
        {teacher && (
          <Card className="h-fit lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle className="text-base text-charcoal/60">
                Your teacher
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-700 text-lg font-bold text-white">
                  {teacher.photoInitials}
                </div>
                <div>
                  <p className="font-bold">{teacher.name}</p>
                  <p className="text-sm text-charcoal/60">
                    {teacher.yearsTeaching} years teaching
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
                {teacher.bio}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8">
        <Button asChild variant="ghost">
          <Link href="/venues">← Back to all venues</Link>
        </Button>
      </div>
    </div>
  );
}
