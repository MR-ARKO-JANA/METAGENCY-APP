import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  Calendar,
  GraduationCap,
  Languages,
  ShieldCheck,
  Star,
  Video,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DoctorPhoto, Panel } from "@/components/medergency/ui";
import { SlotPicker } from "@/components/medergency/SlotPicker";
import { getDoctor } from "@/lib/medergency/store";

export const Route = createFileRoute("/patient/doctors/$doctorId")({
  loader: ({ params }) => {
    const doctor = getDoctor(params.doctorId);
    if (!doctor) throw notFound();
    return { name: doctor.name, specialization: doctor.specialization };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — ${loaderData.specialization} | Medergency` },
          { name: "description", content: `View ${loaderData.name}'s profile and book a video consultation.` },
          { property: "og:title", content: `${loaderData.name} | Medergency` },
          { property: "og:description", content: `${loaderData.specialization} available for video consultations.` },
        ]
      : [{ title: "Doctor not found" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <Panel>
      <p className="text-foreground">Doctor not found.</p>
      <Link to="/patient/doctors" className="text-primary">Back to doctors</Link>
    </Panel>
  ),
  component: Profile,
});

function Profile() {
  const { doctorId } = Route.useParams();
  const doctor = getDoctor(doctorId)!;
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const approved = doctor.verification === "approved";

  return (
    <div className="grid gap-5">

      {/* Back link */}
      <Link
        to="/patient/doctors"
        className="group flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors w-fit animated-underline animate-fade-in-down"
      >
        <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1 duration-200" />
        All doctors
      </Link>

      {/* Hero profile card */}
      <div
        className="relative overflow-hidden rounded-3xl bg-white p-5 sm:p-6 animate-fade-in-up"
        style={{
          boxShadow: "0 4px 32px rgba(37,99,235,0.1)",
          border: "1px solid rgba(59,130,246,0.1)",
        }}
      >
        {/* Decorative gradient blob */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #2563eb 0%, transparent 70%)", animation: "float 6s ease-in-out infinite" }}
        />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start">
          {/* Photo */}
          <div className="relative shrink-0 animate-scale-in">
            <DoctorPhoto doctor={doctor} size={110} />
            {approved && (
              <span
                className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full text-white shadow-md animate-bounce-in"
                style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}
              >
                <ShieldCheck size={14} />
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 animate-fade-in-up delay-75">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-slate-800">{doctor.name}</h1>
              {approved && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}
                >
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="font-bold text-lg" style={{ color: "#2563eb" }}>
              {doctor.specialization}
            </p>
            <p className="text-sm font-medium text-slate-500 mb-4">
              {doctor.experience} years experience
            </p>

            <div className="grid gap-2 text-sm">
              {[
                { icon: GraduationCap, text: doctor.qualifications },
                { icon: Building2, text: doctor.hospital },
                { icon: Languages, text: doctor.languages.join(", ") },
                { icon: Video, text: "Video Consultation" },
                ...(approved ? [{ icon: Star, text: `${doctor.sampleRating} (sample rating, not real reviews)` }] : []),
              ].map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 text-slate-600 animate-fade-in-left"
                  style={{ animationDelay: `${(i + 2) * 60}ms` }}
                >
                  <div
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                    style={{ background: "#eff6ff", color: "#2563eb" }}
                  >
                    <Icon size={13} />
                  </div>
                  <span className="text-[13px]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fee + Book */}
          <div
            className="shrink-0 rounded-2xl p-5 text-center sm:w-48 animate-scale-in delay-200"
            style={{
              background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
              border: "1px solid #bfdbfe",
            }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
              Consultation fee
            </p>
            <p className="text-3xl font-black" style={{ color: "#2563eb" }}>
              ₹{doctor.fee}
            </p>
            <Button
              className="mt-4 w-full rounded-xl font-bold shadow-md btn-ripple animate-pulse-glow"
              style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "white" }}
              disabled={!approved}
              onClick={() =>
                navigate({
                  to: "/patient/book/$doctorId",
                  params: { doctorId },
                  search: date && time ? { date, time } : {},
                })
              }
            >
              Book Appointment
            </Button>
            {!approved && (
              <p className="mt-2 text-[10px] text-slate-400">Verification pending</p>
            )}
          </div>
        </div>
      </div>

      {/* About + Availability */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">

        {/* About card */}
        <div
          className="rounded-2xl bg-white p-5 animate-fade-in-up delay-100"
          style={{
            boxShadow: "0 2px 16px rgba(37,99,235,0.06)",
            border: "1px solid rgba(59,130,246,0.1)",
          }}
        >
          <h2 className="mb-3 text-[17px] font-black text-slate-800">About Doctor</h2>
          <p className="text-sm leading-relaxed text-slate-500">{doctor.bio}</p>
          {approved && (
            <div
              className="mt-4 rounded-xl px-3 py-2 text-xs font-medium text-blue-600"
              style={{ background: "#eff6ff" }}
            >
              {doctor.registration}
            </div>
          )}
        </div>

        {/* Availability card */}
        <div
          className="rounded-2xl bg-white p-5 animate-fade-in-up delay-200"
          style={{
            boxShadow: "0 2px 16px rgba(37,99,235,0.06)",
            border: "1px solid rgba(59,130,246,0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="grid h-8 w-8 place-items-center rounded-xl text-white"
              style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
            >
              <Calendar size={15} />
            </div>
            <h2 className="text-[17px] font-black text-slate-800">Availability calendar</h2>
          </div>
          {approved ? (
            <SlotPicker
              doctorId={doctorId}
              date={date}
              time={time}
              onDate={setDate}
              onTime={setTime}
            />
          ) : (
            <p className="text-sm text-slate-400">
              This doctor's verification is still pending, so booking is not available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
