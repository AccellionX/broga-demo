"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  CreditCard,
  CalendarPlus,
  Mail,
  Loader2,
  Apple,
} from "lucide-react";
import type { Course, ProductType, Venue } from "@/lib/mock-data";
import { PRODUCTS, getTeacher, isMonthlyProduct } from "@/lib/mock-data";
import { formatGBP, cn } from "@/lib/utils";
import { useDemo } from "@/lib/demo-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const STEPS = ["Product", "Details", "Pay"];

interface Props {
  course: Course;
  venue: Venue;
}

export function BookingFlow({ course, venue }: Props) {
  const { addBooking } = useDemo();
  const teacher = getTeacher(venue.teacherId);

  const [step, setStep] = useState(0);
  const [productId, setProductId] = useState<ProductType>(
    course.type === "trial" ? "trial" : "dropin"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [injuries, setInjuries] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const product = PRODUCTS.find((p) => p.id === productId)!;

  function nextFromProduct() {
    setStep(1);
  }

  function nextFromDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill in name, email and phone");
      return;
    }
    setStep(2);
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    const booking = addBooking({
      courseId: course.id,
      venueId: venue.id,
      productType: productId,
      amountPence: product.pricePence,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      injuries: injuries || undefined,
    });
    setBookingId(booking.id);
    setProcessing(false);
    setSuccess(true);
    toast.success("Booking confirmed");
  }

  function mockWalletPay(label: string) {
    setProcessing(true);
    setTimeout(() => {
      const booking = addBooking({
        courseId: course.id,
        venueId: venue.id,
        productType: productId,
        amountPence: product.pricePence,
        customerName: name || "Demo Customer",
        customerEmail: email || "demo@email.com",
        customerPhone: phone || "07700900000",
        injuries: injuries || undefined,
      });
      setBookingId(booking.id);
      setProcessing(false);
      setSuccess(true);
      toast.success(`Paid with ${label}`);
    }, 1500);
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-forest-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-100">
            <Check className="h-8 w-8 text-forest-700" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">You&apos;re booked in</h1>
          <p className="mt-2 text-charcoal/70">
            {product.name} at {venue.name}
          </p>
          <p className="mt-1 text-sm text-charcoal/50">
            Ref {bookingId} · {formatGBP(product.pricePence)}
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={() =>
                toast.message("Calendar event ready", {
                  description: "In production this downloads an .ics file.",
                })
              }
            >
              <CalendarPlus className="h-4 w-4" />
              Add to calendar
            </Button>
            <Button asChild variant="accent">
              <Link href="/account">Go to my account</Link>
            </Button>
          </div>
        </div>

        {/* Email preview */}
        <Card className="mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-forest-600" />
              Here&apos;s the email you&apos;ll receive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-forest-100 bg-cream p-4 text-left text-sm">
              <p className="text-xs text-charcoal/50">
                From: Bro-ga &lt;hello@bro-ga.co.uk&gt;
              </p>
              <p className="mt-1 font-semibold">
                You&apos;re in: {product.name}
              </p>
              <hr className="my-3 border-forest-100" />
              <p>Hi {name.split(" ")[0] || "there"},</p>
              <p className="mt-2 text-charcoal/70">
                Sorted. You&apos;re booked for the {product.name.toLowerCase()} at{" "}
                <strong>{venue.name}</strong>
                {course.type === "trial" && (
                  <>
                    , starting{" "}
                    {new Date(course.startDate).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </>
                )}
                .
              </p>
              <p className="mt-2 text-charcoal/70">
                {venue.dayOfWeek}s at {venue.time} with {teacher?.name}.
              </p>
              <p className="mt-2 text-charcoal/70">
                Bring yourself. Mats are sorted. See you there.
              </p>
              <p className="mt-3 font-semibold text-forest-800">The Bro-ga team</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href={`/venues/${venue.slug}`}
        className="text-sm font-medium text-forest-700 hover:text-accent"
      >
        ← {venue.name}
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Book your spot
      </h1>
      <p className="mt-1 text-charcoal/60">
        {venue.town} · {venue.dayOfWeek}s {venue.time}
      </p>

      {/* Progress */}
      <ol className="mt-6 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                i < step
                  ? "bg-forest-700 text-white"
                  : i === step
                    ? "bg-accent text-white"
                    : "bg-forest-100 text-forest-600"
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "hidden text-xs font-semibold sm:inline",
                i === step ? "text-charcoal" : "text-charcoal/50"
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-1 h-0.5 flex-1",
                  i < step ? "bg-forest-700" : "bg-forest-100"
                )}
              />
            )}
          </li>
        ))}
      </ol>

      {/* Step 1 */}
      {step === 0 && (
        <div className="mt-8 space-y-3">
          {PRODUCTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setProductId(p.id)}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition-colors",
                productId === p.id
                  ? "border-accent bg-accent/5 ring-2 ring-accent/30"
                  : "border-forest-100 bg-white hover:border-forest-300"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold">{p.name}</p>
                    {p.badge && <Badge variant="accent">{p.badge}</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-charcoal/60">{p.description}</p>
                </div>
                <p className="shrink-0 text-lg font-extrabold text-forest-800">
                  {formatGBP(p.pricePence)}
                  {isMonthlyProduct(p.id) && (
                    <span className="text-xs font-medium text-charcoal/50">
                      /mo
                    </span>
                  )}
                </p>
              </div>
            </button>
          ))}
          <Button variant="accent" size="lg" className="mt-4 w-full" onClick={nextFromProduct}>
            Continue
          </Button>
        </div>
      )}

      {/* Step 2 */}
      {step === 1 && (
        <form onSubmit={nextFromDetails} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              className="mt-1.5"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tom Bradley"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="mt-1.5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tom@email.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              className="mt-1.5"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07..."
              required
            />
          </div>
          <div>
            <Label htmlFor="injuries">Any injuries we should know about?</Label>
            <Textarea
              id="injuries"
              className="mt-1.5"
              value={injuries}
              onChange={(e) => setInjuries(e.target.value)}
              placeholder="Optional, e.g. dodgy left knee"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button type="submit" variant="accent" className="flex-1">
              Continue to payment
            </Button>
          </div>
        </form>
      )}

      {/* Step 3: mock Stripe */}
      {step === 2 && (
        <form onSubmit={pay} className="mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Payment
                </span>
                <span className="text-xl font-extrabold text-forest-800">
                  {formatGBP(product.pricePence)}
                  {isMonthlyProduct(product.id) && (
                    <span className="text-sm font-medium text-charcoal/50">
                      /mo
                    </span>
                  )}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Demo checkout. No real card data is collected or charged.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-black text-white hover:bg-black/90 hover:text-white"
                  disabled={processing}
                  onClick={() => mockWalletPay("Apple Pay")}
                >
                  <Apple className="h-4 w-4" /> Apple Pay
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={processing}
                  onClick={() => mockWalletPay("Google Pay")}
                >
                  <span className="font-bold text-[#4285F4]">G</span> Google Pay
                </Button>
              </div>

              <div className="relative py-2 text-center text-xs text-charcoal/40">
                <span className="relative z-10 bg-white px-2">or card</span>
                <div className="absolute left-0 right-0 top-1/2 border-t border-forest-100" />
              </div>

              <div>
                <Label htmlFor="cardName">Name on card</Label>
                <Input
                  id="cardName"
                  className="mt-1.5"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="T BRADLEY"
                />
              </div>
              <div>
                <Label htmlFor="cardNumber">Card number</Label>
                <Input
                  id="cardNumber"
                  className="mt-1.5"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input
                    id="expiry"
                    className="mt-1.5"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM / YY"
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    className="mt-1.5"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  `Pay ${formatGBP(product.pricePence)}`
                )}
              </Button>
              <p className="text-center text-xs text-charcoal/40">
                Powered by Stripe · Demo only
              </p>
            </CardContent>
          </Card>
          <Button
            type="button"
            variant="ghost"
            className="mt-3"
            onClick={() => setStep(1)}
            disabled={processing}
          >
            ← Back
          </Button>
        </form>
      )}
    </div>
  );
}
