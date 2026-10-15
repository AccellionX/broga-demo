"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { List, Map as MapIcon, Search } from "lucide-react";
import {
  VENUES,
  POSTCODE_COORDS,
  getNextClassLabel,
  getTeacher,
  hasTrialStartingSoon,
  COURSES,
  type DayOfWeek,
  type Region,
  type TimeSlot,
} from "@/lib/mock-data";
import { distanceMiles, cn } from "@/lib/utils";
import { useDemo } from "@/lib/demo-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VenueMap = dynamic(
  () =>
    import("@/components/venues/venue-map").then((m) => m.VenueMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-xl bg-forest-50 text-sm text-charcoal/50">
        Loading map…
      </div>
    ),
  }
);

const DAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type ViewMode = "list" | "map";

export function VenueFinder() {
  const searchParams = useSearchParams();
  const { postcode: ctxPostcode, setPostcode } = useDemo();

  const [postcode, setLocalPostcode] = useState(
    searchParams.get("postcode") || ctxPostcode || ""
  );
  const [region, setRegion] = useState<Region | "all">("all");
  const [day, setDay] = useState<DayOfWeek | "all">("all");
  const [timeSlot, setTimeSlot] = useState<TimeSlot | "all">("all");
  const [trialSoon, setTrialSoon] = useState(
    searchParams.get("trial") === "1"
  );
  const [selectedId, setSelectedId] = useState<string>();
  const [view, setView] = useState<ViewMode>("list");

  useEffect(() => {
    const pc = searchParams.get("postcode");
    if (pc) {
      setLocalPostcode(pc);
      setPostcode(pc);
    }
    if (searchParams.get("trial") === "1") setTrialSoon(true);
  }, [searchParams, setPostcode]);

  const origin = useMemo(() => {
    const key = postcode.trim().toUpperCase().replace(/\s+/g, "");
    // match outward code e.g. GU7, SE23, RG27
    const match = Object.keys(POSTCODE_COORDS).find(
      (k) => key === k || key.startsWith(k)
    );
    return match ? POSTCODE_COORDS[match] : null;
  }, [postcode]);

  const filtered = useMemo(() => {
    let list = [...VENUES];
    if (region !== "all") list = list.filter((v) => v.region === region);
    if (day !== "all") list = list.filter((v) => v.dayOfWeek === day);
    if (timeSlot !== "all") list = list.filter((v) => v.timeSlot === timeSlot);
    if (trialSoon) list = list.filter((v) => hasTrialStartingSoon(v.id));

    if (origin) {
      list = list
        .map((v) => ({
          venue: v,
          miles: distanceMiles(origin.lat, origin.lng, v.lat, v.lng),
        }))
        .sort((a, b) => a.miles - b.miles)
        .map((x) => x.venue);
    } else {
      list.sort((a, b) => a.town.localeCompare(b.town));
    }
    return list;
  }, [region, day, timeSlot, trialSoon, origin]);

  function spacesLeft(venueId: string) {
    const trial = COURSES.find((c) => c.venueId === venueId && c.type === "trial");
    return trial?.spacesLeft ?? 0;
  }

  function milesLabel(venueId: string) {
    if (!origin) return null;
    const v = VENUES.find((x) => x.id === venueId)!;
    const m = distanceMiles(origin.lat, origin.lng, v.lat, v.lng);
    return `${m.toFixed(1)} mi`;
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-7.5rem)] max-w-7xl flex-col px-4 py-4 sm:px-6 lg:h-[calc(100dvh-6.5rem)]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Find a class
          </h1>
          <p className="text-sm text-charcoal/60">
            {filtered.length} venue{filtered.length !== 1 ? "s" : ""}
            {origin ? ` near ${origin.label}` : ""}
          </p>
        </div>
        <div className="flex rounded-xl border border-forest-200 bg-white p-1 lg:hidden">
          <button
            type="button"
            onClick={() => setView("list")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold",
              view === "list" ? "bg-forest-700 text-white" : "text-charcoal/70"
            )}
          >
            <List className="h-4 w-4" /> List
          </button>
          <button
            type="button"
            onClick={() => setView("map")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold",
              view === "map" ? "bg-forest-700 text-white" : "text-charcoal/70"
            )}
          >
            <MapIcon className="h-4 w-4" /> Map
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-500" />
          <Input
            value={postcode}
            onChange={(e) => {
              setLocalPostcode(e.target.value);
              setPostcode(e.target.value);
            }}
            placeholder="Postcode e.g. GU7"
            className="pl-9"
          />
        </div>
        <Select
          value={region}
          onValueChange={(v) => setRegion(v as Region | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All regions</SelectItem>
            <SelectItem value="Surrey">Surrey</SelectItem>
            <SelectItem value="Hampshire">Hampshire</SelectItem>
            <SelectItem value="SE London">SE London</SelectItem>
          </SelectContent>
        </Select>
        <Select value={day} onValueChange={(v) => setDay(v as DayOfWeek | "all")}>
          <SelectTrigger>
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any day</SelectItem>
            {DAYS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={timeSlot}
          onValueChange={(v) => setTimeSlot(v as TimeSlot | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any time</SelectItem>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="evening">Evening</SelectItem>
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant={trialSoon ? "accent" : "outline"}
          onClick={() => setTrialSoon((t) => !t)}
          className="w-full"
        >
          Trial starting soon
        </Button>
      </div>

      <div className="min-h-0 flex-1 gap-4 lg:grid lg:grid-cols-2">
        {/* List */}
        <div
          className={cn(
            "h-full overflow-y-auto rounded-xl border border-forest-100 bg-white",
            view === "map" ? "hidden lg:block" : "block"
          )}
        >
          {filtered.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 p-6 text-center text-charcoal/60">
              <p className="font-semibold text-charcoal">No venues match</p>
              <p className="text-sm">Try clearing a filter or another postcode.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRegion("all");
                  setDay("all");
                  setTimeSlot("all");
                  setTrialSoon(false);
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-forest-50">
              {filtered.map((v) => {
                const teacher = getTeacher(v.teacherId);
                const spaces = spacesLeft(v.id);
                const miles = milesLabel(v.id);
                const selected = selectedId === v.id;
                return (
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(v.id)}
                      className={cn(
                        "w-full p-4 text-left transition-colors hover:bg-forest-50/80",
                        selected && "bg-forest-50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-charcoal">{v.name}</p>
                          <p className="text-sm text-charcoal/60">
                            {v.town}, {v.region}
                            {miles && (
                              <span className="text-forest-600"> · {miles}</span>
                            )}
                          </p>
                        </div>
                        {hasTrialStartingSoon(v.id) && (
                          <Badge variant="accent">Trial soon</Badge>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-charcoal/70">
                        <span>{getNextClassLabel(v)}</span>
                        <span>·</span>
                        <span>{teacher?.name}</span>
                        <span>·</span>
                        <span
                          className={
                            spaces <= 4
                              ? "font-semibold text-accent"
                              : "text-forest-700"
                          }
                        >
                          {spaces} spaces left
                        </span>
                      </div>
                      <Link
                        href={`/venues/${v.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 inline-block text-sm font-semibold text-forest-700 hover:text-accent"
                      >
                        View classes →
                      </Link>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Map */}
        <div
          className={cn(
            "h-full min-h-[320px] overflow-hidden rounded-xl border border-forest-100",
            view === "list" ? "hidden lg:block" : "block"
          )}
        >
          <VenueMap
            venues={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      </div>
    </div>
  );
}
