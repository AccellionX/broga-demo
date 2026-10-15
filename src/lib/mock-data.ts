/**
 * Deterministic seeded mock data for the Bro-ga sales demo.
 * Numbers stay stable across refreshes.
 */

export type Region = "Surrey" | "Hampshire" | "SE London";
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export type TimeSlot = "morning" | "evening";
export type ProductType =
  | "trial"
  | "gold"
  | "platinum"
  | "pack10"
  | "dropin";
export type CustomerStatus =
  | "lead"
  | "trial"
  | "pack"
  | "member"
  | "lapsed"
  | "churned";
export type MembershipTier = "gold" | "platinum";
export type Role = "customer" | "teacher" | "owner";

export function isMonthlyProduct(id: ProductType): boolean {
  return id === "gold" || id === "platinum";
}

export interface Teacher {
  id: string;
  name: string;
  bio: string;
  photoInitials: string;
  yearsTeaching: number;
  venueIds: string[];
}

export interface Venue {
  id: string;
  slug: string;
  name: string;
  town: string;
  region: Region;
  address: string;
  postcode: string;
  lat: number;
  lng: number;
  teacherId: string;
  capacity: number;
  dayOfWeek: DayOfWeek;
  time: string; // "19:00"
  timeSlot: TimeSlot;
  parking: string;
  whatToBring: string;
  photoColor: string;
}

export interface Course {
  id: string;
  venueId: string;
  type: "trial" | "ongoing";
  name: string;
  startDate: string; // ISO date
  weekNumber?: number; // for ongoing display
  spacesLeft: number;
  capacity: number;
  pricePence: number;
  dayOfWeek: DayOfWeek;
  time: string;
}

export interface ClassSession {
  id: string;
  venueId: string;
  teacherId: string;
  date: string;
  time: string;
  capacity: number;
  booked: number;
  courseId?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  venueId: string;
  trialWeek?: number; // 1-5
  packCredits?: number;
  memberSince?: string;
  injuries?: string;
  joinedAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  courseId?: string;
  venueId: string;
  productType: ProductType;
  amountPence: number;
  createdAt: string;
  status: "confirmed" | "cancelled";
}

export interface Payment {
  id: string;
  customerId: string;
  amountPence: number;
  productType: ProductType;
  date: string;
  status: "paid" | "failed" | "refunded";
}

export interface MonthlyRevenue {
  month: string; // "2025-01"
  revenuePence: number;
  members: number;
  trials: number;
}

export interface Product {
  id: ProductType;
  name: string;
  description: string;
  pricePence: number;
  popular?: boolean;
  ctaLabel?: string;
  perClassHint?: string;
  badge?: string;
}

// ── Seeded PRNG (mulberry32) ──────────────────────────────────────────
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const randInt = (min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;

// ── Static reference data ─────────────────────────────────────────────

/** Real Bro-ga plan prices (GBP). PAYG single-class rate is a demo estimate (not listed publicly). */
export const PRODUCTS: Product[] = [
  {
    id: "trial",
    name: "5-week beginner trial",
    description:
      "Five consecutive classes, a new mat, and a cold beer after each session. The proper way to start.",
    pricePence: 7900,
    popular: true,
    badge: "Start here",
    ctaLabel: "Book trial",
    perClassHint: "£15.80/class",
  },
  {
    id: "gold",
    name: "Gold membership",
    description:
      "One session a week at any venue. 6-month initial commitment, then rolling monthly.",
    pricePence: 5900,
    perClassHint: "£59/mo",
  },
  {
    id: "platinum",
    name: "Platinum membership",
    description:
      "Unlimited sessions across all venues. 6-month initial commitment, then rolling monthly.",
    pricePence: 8900,
    perClassHint: "£89/mo",
  },
  {
    id: "pack10",
    name: "10-class pack",
    description: "Ten classes at any Bro-ga venue. Use within 17 weeks.",
    pricePence: 16500,
    perClassHint: "£16.50/class",
  },
  {
    id: "dropin",
    name: "Pay-as-you-go",
    description: "Single class at any venue. No commitment.",
    pricePence: 2000,
    perClassHint: "£20/class",
  },
];

export const PRODUCT_BY_ID = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p])
) as Record<ProductType, Product>;

export const POSTCODE_COORDS: Record<string, { lat: number; lng: number; label: string }> = {
  GU7: { lat: 51.1858, lng: -0.612, label: "Godalming" },
  GU8: { lat: 51.142, lng: -0.645, label: "Witley / Milford" },
  RG27: { lat: 51.294, lng: -0.942, label: "Hook / Hartley Wintney" },
  SE23: { lat: 51.441, lng: -0.051, label: "Forest Hill" },
  SE13: { lat: 51.461, lng: -0.008, label: "Lewisham" },
  GU1: { lat: 51.2362, lng: -0.5704, label: "Guildford" },
  GU2: { lat: 51.248, lng: -0.59, label: "Guildford West" },
  KT11: { lat: 51.33, lng: -0.41, label: "Cobham" },
  RH2: { lat: 51.239, lng: -0.206, label: "Reigate" },
  SO23: { lat: 51.0632, lng: -1.308, label: "Winchester" },
};

const FIRST_NAMES = [
  "James", "Tom", "Dave", "Chris", "Matt", "Ben", "Sam", "Luke", "Jack", "Will",
  "Alex", "Dan", "Nick", "Rob", "Pete", "Mark", "Steve", "Andy", "Joe", "Harry",
  "Ollie", "George", "Charlie", "Adam", "Paul", "Phil", "Rich", "Jon", "Mike", "Ed",
];

const LAST_NAMES = [
  "Smith", "Jones", "Taylor", "Brown", "Wilson", "Davies", "Evans", "Thomas",
  "Johnson", "Roberts", "Walker", "Wright", "Robinson", "Thompson", "White",
  "Hughes", "Edwards", "Green", "Hall", "Lewis", "Harris", "Clarke", "Patel",
  "Mitchell", "Young", "Allen", "King", "Wright", "Scott", "Baker",
];

const VILLAGES = [
  "Godalming", "Haslemere", "Farnham", "Guildford", "Woking", "Dorking",
  "Reigate", "Leatherhead", "Cobham", "Esher", "Alton", "Petersfield",
  "Basingstoke", "Fleet", "Farnborough", "Winchester", "Andover",
  "Forest Hill", "Lewisham", "Beckenham", "Bromley", "Orpington", "Croydon",
];

// ── Teachers ──────────────────────────────────────────────────────────

export const TEACHERS: Teacher[] = [
  {
    id: "t1",
    name: "Marcus Hale",
    bio: "Ex-rugby prop who found yoga after a bad back. Specialises in making stiff blokes feel welcome. 8 years teaching.",
    photoInitials: "MH",
    yearsTeaching: 8,
    venueIds: [],
  },
  {
    id: "t2",
    name: "Jake Thornton",
    bio: "Former PE teacher. Keeps it practical, no Sanskrit required. Loves village hall energy.",
    photoInitials: "JT",
    yearsTeaching: 5,
    venueIds: [],
  },
  {
    id: "t3",
    name: "Sam Okonkwo",
    bio: "Started Bro-ga after years of corporate burnout. Calm, clear cues, zero judgment.",
    photoInitials: "SO",
    yearsTeaching: 6,
    venueIds: [],
  },
  {
    id: "t4",
    name: "Dan Fletcher",
    bio: "Climbing instructor by day, yoga teacher by evening. Great for tight hips and shoulders.",
    photoInitials: "DF",
    yearsTeaching: 4,
    venueIds: [],
  },
  {
    id: "t5",
    name: "Chris Patel",
    bio: "Trained in Goa, teaches in Surrey. Mixes strength and stretch so you leave feeling sorted.",
    photoInitials: "CP",
    yearsTeaching: 7,
    venueIds: [],
  },
  {
    id: "t6",
    name: "Ben Cartwright",
    bio: "Army veteran. Runs a tight, friendly class. Knows what tight hamstrings feel like.",
    photoInitials: "BC",
    yearsTeaching: 3,
    venueIds: [],
  },
  {
    id: "t7",
    name: "Ollie Grant",
    bio: "Surrey lad, trained in London. Keeps classes moving and banter light.",
    photoInitials: "OG",
    yearsTeaching: 4,
    venueIds: [],
  },
  {
    id: "t8",
    name: "Will Brennan",
    bio: "SE London based. Built for beginners who've never touched a mat. Patient and clear.",
    photoInitials: "WB",
    yearsTeaching: 5,
    venueIds: [],
  },
];

// ── Venues (23) ───────────────────────────────────────────────────────

const VENUE_DEFS: Omit<Venue, "id" | "slug" | "teacherId" | "photoColor">[] = [
  { name: "Godalming Village Hall", town: "Godalming", region: "Surrey", address: "Bridge Road", postcode: "GU7 1HT", lat: 51.1858, lng: -0.612, capacity: 20, dayOfWeek: "Monday", time: "19:00", timeSlot: "evening", parking: "Free car park behind the hall", whatToBring: "Just yourself. Mats provided." },
  { name: "Haslemere Hall", town: "Haslemere", region: "Surrey", address: "Bridge Road", postcode: "GU27 2AS", lat: 51.089, lng: -0.711, capacity: 18, dayOfWeek: "Tuesday", time: "19:30", timeSlot: "evening", parking: "On-street parking nearby", whatToBring: "Comfortable clothes. Mats provided." },
  { name: "Farnham Memorial Hall", town: "Farnham", region: "Surrey", address: "West Street", postcode: "GU9 7EN", lat: 51.214, lng: -0.799, capacity: 22, dayOfWeek: "Wednesday", time: "18:30", timeSlot: "evening", parking: "Public car park 2 mins walk", whatToBring: "Water bottle recommended." },
  { name: "Guildford Stoke Park Pavilion", town: "Guildford", region: "Surrey", address: "London Road", postcode: "GU1 1TU", lat: 51.248, lng: -0.555, capacity: 24, dayOfWeek: "Thursday", time: "19:00", timeSlot: "evening", parking: "Free park parking", whatToBring: "Mats provided. Socks optional." },
  { name: "Woking Village Community Centre", town: "Woking", region: "Surrey", address: "Oriental Road", postcode: "GU22 7BA", lat: 51.319, lng: -0.557, capacity: 20, dayOfWeek: "Monday", time: "20:00", timeSlot: "evening", parking: "Centre car park", whatToBring: "Just turn up." },
  { name: "Dorking Christian Centre", town: "Dorking", region: "Surrey", address: "Church Street", postcode: "RH4 1DW", lat: 51.232, lng: -0.332, capacity: 16, dayOfWeek: "Tuesday", time: "10:00", timeSlot: "morning", parking: "Limited on-street", whatToBring: "Mats provided." },
  { name: "Reigate Community Hall", town: "Reigate", region: "Surrey", address: "High Street", postcode: "RH2 9AE", lat: 51.239, lng: -0.206, capacity: 18, dayOfWeek: "Wednesday", time: "19:00", timeSlot: "evening", parking: "Town car parks nearby", whatToBring: "Loose clothing." },
  { name: "Leatherhead Institute", town: "Leatherhead", region: "Surrey", address: "High Street", postcode: "KT22 8AN", lat: 51.296, lng: -0.329, capacity: 20, dayOfWeek: "Thursday", time: "18:45", timeSlot: "evening", parking: "Multi-storey 3 mins", whatToBring: "Mats provided." },
  { name: "Cobham Village Hall", town: "Cobham", region: "Surrey", address: "Anyards Road", postcode: "KT11 2LW", lat: 51.33, lng: -0.41, capacity: 16, dayOfWeek: "Friday", time: "19:00", timeSlot: "evening", parking: "Hall car park", whatToBring: "Just yourself." },
  { name: "Esher Methodist Hall", town: "Esher", region: "Surrey", address: "High Street", postcode: "KT10 9QD", lat: 51.369, lng: -0.365, capacity: 18, dayOfWeek: "Saturday", time: "09:30", timeSlot: "morning", parking: "Nearby free parking Saturday", whatToBring: "Mats provided." },
  { name: "Alton Assembly Rooms", town: "Alton", region: "Hampshire", address: "High Street", postcode: "GU34 1BA", lat: 51.151, lng: -0.975, capacity: 20, dayOfWeek: "Monday", time: "19:15", timeSlot: "evening", parking: "Town parking nearby", whatToBring: "Water bottle." },
  { name: "Petersfield Festival Hall", town: "Petersfield", region: "Hampshire", address: "Heath Road", postcode: "GU31 4EA", lat: 51.004, lng: -0.937, capacity: 22, dayOfWeek: "Tuesday", time: "19:00", timeSlot: "evening", parking: "Free hall parking", whatToBring: "Mats provided." },
  { name: "Basingstoke Carnival Hall", town: "Basingstoke", region: "Hampshire", address: "Council Road", postcode: "RG21 7QW", lat: 51.266, lng: -1.092, capacity: 24, dayOfWeek: "Wednesday", time: "18:30", timeSlot: "evening", parking: "Adjacent car park", whatToBring: "Comfortable clothes." },
  { name: "Fleet Community Centre", town: "Fleet", region: "Hampshire", address: "Church Road", postcode: "GU51 4NB", lat: 51.279, lng: -0.842, capacity: 18, dayOfWeek: "Thursday", time: "19:30", timeSlot: "evening", parking: "Free on-site", whatToBring: "Mats provided." },
  { name: "Farnborough Village Hall", town: "Farnborough", region: "Hampshire", address: "Prospect Avenue", postcode: "GU14 8JT", lat: 51.292, lng: -0.755, capacity: 16, dayOfWeek: "Friday", time: "18:45", timeSlot: "evening", parking: "Street parking", whatToBring: "Just turn up." },
  { name: "Winchester St Paul's Hall", town: "Winchester", region: "Hampshire", address: "St Paul's Hill", postcode: "SO22 5AB", lat: 51.063, lng: -1.325, capacity: 20, dayOfWeek: "Saturday", time: "10:00", timeSlot: "morning", parking: "Park & walk 5 mins", whatToBring: "Mats provided." },
  { name: "Andover Guildhall Annex", town: "Andover", region: "Hampshire", address: "High Street", postcode: "SP10 1LP", lat: 51.208, lng: -1.479, capacity: 18, dayOfWeek: "Monday", time: "19:00", timeSlot: "evening", parking: "Town centre car parks", whatToBring: "Loose clothing." },
  { name: "Hook Community Hall", town: "Hook", region: "Hampshire", address: "London Road", postcode: "RG27 9DY", lat: 51.282, lng: -0.96, capacity: 16, dayOfWeek: "Tuesday", time: "19:15", timeSlot: "evening", parking: "Hall car park", whatToBring: "Mats provided." },
  { name: "Forest Hill Community Centre", town: "Forest Hill", region: "SE London", address: "Dartmouth Road", postcode: "SE23 3HZ", lat: 51.441, lng: -0.051, capacity: 20, dayOfWeek: "Monday", time: "19:30", timeSlot: "evening", parking: "Limited; tube/bus recommended", whatToBring: "Mats provided." },
  { name: "Lewisham Parish Hall", town: "Lewisham", region: "SE London", address: "Lewisham High Street", postcode: "SE13 6AA", lat: 51.461, lng: -0.008, capacity: 18, dayOfWeek: "Wednesday", time: "19:00", timeSlot: "evening", parking: "NCP nearby", whatToBring: "Just yourself." },
  { name: "Beckenham Public Hall", town: "Beckenham", region: "SE London", address: "Bromley Road", postcode: "BR3 5JE", lat: 51.408, lng: -0.025, capacity: 22, dayOfWeek: "Thursday", time: "18:30", timeSlot: "evening", parking: "Side street free after 6pm", whatToBring: "Mats provided." },
  { name: "Bromley Church House", town: "Bromley", region: "SE London", address: "Church Road", postcode: "BR2 0EG", lat: 51.404, lng: 0.015, capacity: 16, dayOfWeek: "Tuesday", time: "20:00", timeSlot: "evening", parking: "Church car park", whatToBring: "Water bottle." },
  { name: "Orpington Methodist Hall", town: "Orpington", region: "SE London", address: "Sevenoaks Road", postcode: "BR6 9JU", lat: 51.374, lng: 0.098, capacity: 18, dayOfWeek: "Friday", time: "19:00", timeSlot: "evening", parking: "Free hall parking", whatToBring: "Mats provided." },
];

const PHOTO_COLORS = [
  "#2D6A4F", "#40916C", "#1B4332", "#52796F", "#354F52",
  "#3A5A40", "#588157", "#344E41", "#2C6E49", "#4A7C59",
];

export const VENUES: Venue[] = VENUE_DEFS.map((v, i) => {
  const teacher = TEACHERS[i % TEACHERS.length];
  const slug = v.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const venue: Venue = {
    ...v,
    id: `v${i + 1}`,
    slug,
    teacherId: teacher.id,
    photoColor: PHOTO_COLORS[i % PHOTO_COLORS.length],
  };
  teacher.venueIds.push(venue.id);
  return venue;
});

// ── Courses (trial courses starting soon) ─────────────────────────────

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const TODAY = "2026-04-14"; // fixed "today" for demo consistency

export const COURSES: Course[] = VENUES.flatMap((venue, i) => {
  const courses: Course[] = [];
  // Upcoming trial; some starting soon
  const startOffset = (i % 5) * 7 + 3; // stagger starts
  const startDate = addDays(TODAY, startOffset);
  const spacesLeft = randInt(2, Math.max(3, venue.capacity - 8));
  courses.push({
    id: `c-trial-${venue.id}`,
    venueId: venue.id,
    type: "trial",
    name: "5-week beginner course",
    startDate,
    spacesLeft,
    capacity: venue.capacity,
    pricePence: PRODUCT_BY_ID.trial.pricePence,
    dayOfWeek: venue.dayOfWeek,
    time: venue.time,
  });
  // Ongoing weekly class reference
  courses.push({
    id: `c-ongoing-${venue.id}`,
    venueId: venue.id,
    type: "ongoing",
    name: "Weekly Bro-ga class",
    startDate: addDays(TODAY, -((i % 7) + 1)),
    spacesLeft: randInt(3, 10),
    capacity: venue.capacity,
    pricePence: PRODUCT_BY_ID.dropin.pricePence,
    dayOfWeek: venue.dayOfWeek,
    time: venue.time,
  });
  return courses;
});

export function getVenueBySlug(slug: string): Venue | undefined {
  return VENUES.find((v) => v.slug === slug);
}

export function getTeacher(id: string): Teacher | undefined {
  return TEACHERS.find((t) => t.id === id);
}

export function getCoursesForVenue(venueId: string): Course[] {
  return COURSES.filter((c) => c.venueId === venueId);
}

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function getNextClassLabel(venue: Venue): string {
  return `${venue.dayOfWeek}s ${venue.time}`;
}

export function hasTrialStartingSoon(venueId: string, withinDays = 21): boolean {
  const trial = COURSES.find((c) => c.venueId === venueId && c.type === "trial");
  if (!trial) return false;
  const start = new Date(trial.startDate).getTime();
  const today = new Date(TODAY).getTime();
  const days = (start - today) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= withinDays;
}

// ── Customers (~400) ──────────────────────────────────────────────────

const STATUSES: CustomerStatus[] = [
  "member", "member", "member", "member",
  "trial", "trial",
  "pack", "pack",
  "lapsed",
  "lead",
  "churned",
];

export const CUSTOMERS: Customer[] = Array.from({ length: 400 }, (_, i) => {
  const venue = VENUES[i % VENUES.length];
  const status = STATUSES[i % STATUSES.length];
  const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
  const customer: Customer = {
    id: `cust-${i + 1}`,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
    phone: `07${String(700000000 + i).slice(0, 9)}`,
    status,
    venueId: venue.id,
    joinedAt: addDays(TODAY, -randInt(14, 400)),
  };
  if (status === "trial") customer.trialWeek = randInt(1, 5);
  if (status === "pack") customer.packCredits = randInt(1, 10);
  if (status === "member") customer.memberSince = addDays(TODAY, -randInt(30, 360));
  if (i % 11 === 0) customer.injuries = pick(["Lower back", "Left knee", "Shoulder", "Tight hamstrings"]);
  return customer;
});

/** Demo customer shown in /account; mid trial journey */
export const DEMO_CUSTOMER: Customer = {
  id: "cust-demo",
  firstName: "Tom",
  lastName: "Bradley",
  email: "tom.bradley@email.com",
  phone: "07700900123",
  status: "trial",
  venueId: "v1",
  trialWeek: 3,
  packCredits: 0,
  injuries: undefined,
  joinedAt: addDays(TODAY, -21),
};

// ── Revenue (12 months, upward trend) from real plan prices ───────────

const GOLD_PRICE = PRODUCT_BY_ID.gold.pricePence;
const PLAT_PRICE = PRODUCT_BY_ID.platinum.pricePence;
const TRIAL_PRICE = PRODUCT_BY_ID.trial.pricePence;
const PACK_PRICE = PRODUCT_BY_ID.pack10.pricePence;
const DROPIN_PRICE = PRODUCT_BY_ID.dropin.pricePence;

/** ~70% Gold / 30% Platinum split of active members */
function memberSplit(totalMembers: number) {
  const gold = Math.round(totalMembers * 0.7);
  return { gold, platinum: totalMembers - gold };
}

function monthRevenuePence(
  members: number,
  trialsSold: number,
  packsSold: number,
  dropinsSold: number
) {
  const { gold, platinum } = memberSplit(members);
  return (
    gold * GOLD_PRICE +
    platinum * PLAT_PRICE +
    trialsSold * TRIAL_PRICE +
    packsSold * PACK_PRICE +
    dropinsSold * DROPIN_PRICE
  );
}

export const MONTHLY_REVENUE: MonthlyRevenue[] = Array.from({ length: 12 }, (_, i) => {
  const d = new Date(2025, 4 + i, 1); // May 2025 → Apr 2026
  const members = 160 + i * 14 + randInt(-4, 6);
  const trials = 38 + i * 3 + randInt(-2, 4);
  const packs = 12 + Math.floor(i * 0.8) + randInt(0, 3);
  const dropins = 55 + i * 4 + randInt(-5, 8);
  return {
    month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    revenuePence: monthRevenuePence(members, trials, packs, dropins),
    members,
    trials,
  };
});

const latest = MONTHLY_REVENUE[11];
const { gold: goldMembers, platinum: platinumMembers } = memberSplit(
  latest.members
);

export const MEMBERSHIP_COUNTS = {
  gold: goldMembers,
  platinum: platinumMembers,
};

export const FUNNEL = [
  { stage: "Trial booked", count: 320 },
  { stage: "Attended wk1", count: 280 },
  { stage: "Completed wk5", count: 210 },
  { stage: "Converted to member", count: 134 },
];

export const KPI = {
  activeMembers: latest.members,
  goldMembers,
  platinumMembers,
  mrrPence: goldMembers * GOLD_PRICE + platinumMembers * PLAT_PRICE,
  trialConversion: FUNNEL[3].count / FUNNEL[0].count,
  classesThisWeek: 23,
  avgAttendance: 0.72,
  revenueThisMonthPence: latest.revenuePence,
  trialsSoldThisMonth: latest.trials,
};

/** This month's revenue mix, priced from live PRODUCTS */
export const REVENUE_BY_PRODUCT = [
  {
    product: "Gold membership",
    revenuePence: goldMembers * GOLD_PRICE,
  },
  {
    product: "Platinum membership",
    revenuePence: platinumMembers * PLAT_PRICE,
  },
  {
    product: "5-week trial",
    revenuePence: latest.trials * TRIAL_PRICE,
  },
  {
    product: "10-class pack",
    revenuePence: 18 * PACK_PRICE,
  },
  {
    product: "Pay-as-you-go",
    revenuePence: 72 * DROPIN_PRICE,
  },
];

// ── Testimonials & FAQ ────────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    name: "Dave",
    village: "Godalming",
    quote:
      "I thought yoga wasn't for blokes like me. Turns out the only hard bit was walking through the door. Now I don't miss a Monday.",
  },
  {
    name: "Chris",
    village: "Fleet",
    quote:
      "Village hall, no mirrors, no Lycra brigade. Just a decent stretch after work. The 5-week course got me hooked.",
  },
  {
    name: "Sam",
    village: "Forest Hill",
    quote:
      "Proper beginners stuff. Marcus doesn't make you feel daft when you fall over. Back's better than it's been in years.",
  },
];

export const FAQS = [
  {
    q: "Do I need to be flexible?",
    a: "Nope. Most of our lot couldn't touch their toes when they started. That's literally the point.",
  },
  {
    q: "What should I wear?",
    a: "Trackies and a T-shirt is fine. No special kit. Mats and blocks are provided at every hall.",
  },
  {
    q: "I'm completely new. Will I keep up?",
    a: "The 5-week beginner course is built for absolute beginners. Same teacher, same group, every week. Nobody's judging.",
  },
  {
    q: "Can I try one class before committing?",
    a: "Yes. Pay-as-you-go is £20 a class. Or jump on the £79 five-week trial if you want the proper start.",
  },
  {
    q: "What if I miss a week on the trial?",
    a: "Life happens. Tell your teacher and we'll sort a catch-up at another venue if we can.",
  },
  {
    q: "Where do you run classes?",
    a: "23 village halls across Surrey, Hampshire and south-east London. More coming.",
  },
];

export const BRAND = {
  name: "Bro-ga",
  tagline: "Yoga for men. No experience needed.",
  demoBanner: "Concept demo · sample data · built by AccellionX",
};

export { TODAY, VILLAGES };
