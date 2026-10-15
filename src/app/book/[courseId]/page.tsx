import { notFound } from "next/navigation";
import { COURSES, getCourse, VENUES } from "@/lib/mock-data";
import { BookingFlow } from "@/components/booking/booking-flow";

export function generateStaticParams() {
  return COURSES.filter((c) => c.type === "trial").map((c) => ({
    courseId: c.id,
  }));
}

export function generateMetadata({ params }: { params: { courseId: string } }) {
  const course = getCourse(params.courseId);
  return {
    title: course ? `Book · ${course.name} · Bro-ga` : "Book · Bro-ga",
  };
}

export default function BookPage({ params }: { params: { courseId: string } }) {
  const course = getCourse(params.courseId);
  if (!course) notFound();

  const venue = VENUES.find((v) => v.id === course.venueId);
  if (!venue) notFound();

  return <BookingFlow course={course} venue={venue} />;
}
