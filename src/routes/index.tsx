import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Stethoscope, UserRound, ShieldCheck, Video, Pill, Ambulance, Building2 } from "lucide-react";
import { useState } from "react";
import companyLogo from "@/assets/signal-2026-09-15-23-14-14-623.png";
import companyName from "@/assets/signal-2026-09-15-23-14-14-623_002.png";
import doctorImg from "@/assets/doctor-3.jpg";
import doctorAvt from "@/assets/doctorAvt.jpg";
import patientAvt from "@/assets/PatientAvt.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medergency — Online Consultations with Verified Doctors" },
      {
        name: "description",
        content: "Consult a doctor, connect in minutes. Fast. Trusted. Always.",
      },
    ],
  }),
  component: Landing,
});

/* ─── Splash features list ──────────────────────────────── */
const features = [
  { icon: <UserRound size={18} />, label: "Consult a Doctor" },
  { icon: <Pill size={18} />, label: "Medicine Delivery" },
  { icon: <Ambulance size={18} />, label: "Ambulance Service" },
  { icon: <Building2 size={18} />, label: "Hospital Booking" },
  { icon: <ShieldCheck size={18} />, label: "Diagnostics" },
];

/* ─── Patient SVG avatar ──────────────────────────────────
   Simple inline SVG resembling a sitting woman in blue tones */
function PatientAvatar() {
  return (
    <svg viewBox="0 0 90 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      {/* body / chair */}
      <ellipse cx="45" cy="108" rx="30" ry="6" fill="#DBEAFE" />
      {/* torso */}
      <rect x="28" y="58" width="34" height="38" rx="10" fill="#3B82F6" />
      {/* arms */}
      <rect x="14" y="62" width="16" height="9" rx="4.5" fill="#3B82F6" />
      <rect x="60" y="62" width="16" height="9" rx="4.5" fill="#3B82F6" />
      {/* head */}
      <circle cx="45" cy="44" r="18" fill="#FDDCB5" />
      {/* hair */}
      <path d="M27 40 Q28 22 45 20 Q62 22 63 40 Q60 28 45 26 Q30 28 27 40Z" fill="#7C3AED" />
      {/* legs */}
      <rect x="32" y="90" width="12" height="18" rx="6" fill="#1D4ED8" />
      <rect x="46" y="90" width="12" height="18" rx="6" fill="#1D4ED8" />
    </svg>
  );
}

/* ─── Doctor SVG avatar ──────────────────────────────────── */
function DoctorAvatar() {
  return (
    <svg viewBox="0 0 90 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <ellipse cx="45" cy="108" rx="30" ry="6" fill="#EDE9FE" />
      {/* lab coat */}
      <rect x="26" y="58" width="38" height="40" rx="10" fill="#FFFFFF" />
      {/* shirt under */}
      <rect x="36" y="58" width="18" height="40" rx="2" fill="#EDE9FE" />
      {/* stethoscope */}
      <path d="M38 72 Q38 82 45 84 Q52 82 52 72" stroke="#7C3AED" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* arms */}
      <rect x="12" y="62" width="16" height="9" rx="4.5" fill="#FFFFFF" />
      <rect x="62" y="62" width="16" height="9" rx="4.5" fill="#FFFFFF" />
      {/* head */}
      <circle cx="45" cy="44" r="18" fill="#FDDCB5" />
      {/* hair */}
      <path d="M27 40 Q30 24 45 22 Q60 24 63 40 Q58 29 45 28 Q32 29 27 40Z" fill="#374151" />
    </svg>
  );
}

function Landing() {
  const [step, setStep] = useState<"splash" | "role">("splash");
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground">

      {/* ══════════════════════════════════════════════════════════════
          MOBILE VIEW: Full-screen app experience
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden md:hidden">

        {/* ── STEP 1: Splash ── */}
        <div
          className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
            step === "splash" ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          {/* Deep blue gradient background */}
          <div
            className="flex flex-1 flex-col"
            style={{
              background: "linear-gradient(160deg, #1E40AF 0%, #2563EB 40%, #3B82F6 70%, #93C5FD 100%)",
            }}
          >
            {/* Top hero area */}
            <div className="flex flex-1 flex-col items-start justify-between px-6 pt-14 pb-6">
              {/* Logo */}
              <div className="flex flex-col items-center w-full mb-4">
                <img src={companyLogo} alt="Logo" className="h-20 w-auto object-contain drop-shadow-lg" style={{ filter: "brightness(0) invert(1)" }} />
                <img src={companyName} alt="Medergency" className="mt-2 h-8 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
                <p className="mt-1 text-xs font-semibold tracking-widest text-white/80 uppercase">Life Deserves Care</p>
              </div>

              {/* Doctor image floated right + tagline */}
              <div className="relative w-full flex items-end">
                <div className="flex-1">
                  <p className="text-white/80 text-sm font-medium mb-1">Fast. Trusted. Always.</p>
                  {/* Feature pills */}
                  <div className="mt-3 flex flex-col gap-2.5">
                    {features.map((f) => (
                      <div key={f.label} className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                          {f.icon}
                        </div>
                        <span className="text-sm font-medium text-white">{f.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Doctor image */}
                <div
                  className="absolute right-0 bottom-0 h-52 w-36 overflow-hidden rounded-t-3xl"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  <img
                    src={doctorImg}
                    alt="Doctor"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* Bottom white card area */}
            <div
              className="rounded-t-3xl bg-white/10 backdrop-blur-sm px-6 pt-5 pb-10"
            >
              <p className="text-center text-sm text-white/80 mb-4">
                Your health, our priority.
              </p>
              {/* Pagination dots */}
              <div className="flex justify-center gap-1.5 mb-5">
                <div className="h-1.5 w-6 rounded-full bg-white"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-white/40"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-white/40"></div>
              </div>
              {/* CTA */}
              <button
                onClick={() => setStep("role")}
                className="flex w-full items-center justify-between rounded-2xl bg-white px-6 py-4 text-left font-bold text-[#2563EB] shadow-lg active:scale-95 transition-transform"
              >
                <span className="text-lg">Get Started</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-md">
                  <ArrowRight size={20} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ── STEP 2: Role Selector ── */}
        <div
          className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
            step === "role" ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
          }`}
          style={{ background: "#F0F5FF" }}
        >
          {/* Top header with logo */}
          <div className="flex flex-col items-center pt-12 pb-4 px-6">
            <img src={companyLogo} alt="Logo" className="h-14 w-auto object-contain" />
            <img src={companyName} alt="Medergency" className="mt-2 h-6 w-auto object-contain" />
            <p className="mt-0.5 text-[10px] font-semibold tracking-widest text-[#6B7280] uppercase">Life Deserves Care</p>
          </div>


          {/* Heading */}
          <div className="px-6 mb-6">
            <h1 className="text-2xl font-bold text-[#111827]">Who are you?</h1>
            <p className="mt-1 text-sm text-[#6B7280] leading-relaxed">
              Choose your role to get the best experience on Medergency.
            </p>
          </div>

          {/* Role cards */}
          <div className="flex flex-col gap-4 px-6">

            {/* Patient card */}
            <button
              onClick={() => navigate({ to: "/patient/login" })}
              className="group flex w-full items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-sm active:scale-[0.98] transition-all border border-[#E5EDFF] hover:border-[#93C5FD] hover:shadow-md"
            >
              <div className="h-[72px] w-[72px] shrink-0">
                <img src={patientAvt} alt="Patient" className="h-full w-full object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#111827]">I am a Patient</h3>
                <p className="mt-0.5 text-[11px] text-[#6B7280] leading-relaxed">
                  Book a doctor, get prescriptions,<br />track your health and more.
                </p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-md group-hover:bg-[#1D4ED8] transition-colors">
                <ArrowRight size={18} />
              </div>
            </button>

            {/* Doctor card */}
            <button
              onClick={() => navigate({ to: "/doctor/login" })}
              className="group flex w-full items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-sm active:scale-[0.98] transition-all border border-[#EDE9FE] hover:border-[#C4B5FD] hover:shadow-md"
            >
              <div className="h-[72px] w-[72px] shrink-0">
                <img src={doctorAvt} alt="Doctor" className="h-full w-full object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#111827]">I am a Doctor</h3>
                <p className="mt-0.5 text-[11px] text-[#6B7280] leading-relaxed">
                  Manage consultations, help patients,<br />and grow your practice.
                </p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-white shadow-md group-hover:bg-[#6D28D9] transition-colors">
                <ArrowRight size={18} />
              </div>
            </button>
          </div>

          {/* Bottom terms */}
          <div className="mt-auto px-6 pb-8 text-center text-[11px] text-[#9CA3AF]">
            By continuing, you agree to our{" "}
            <span className="font-semibold text-[#2563EB]">Terms & Conditions</span>{" "}
            and <span className="font-semibold text-[#2563EB]">Privacy Policy</span>.
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          DESKTOP VIEW: Full portal experience
      ══════════════════════════════════════════════════════════════ */}
      <div className="hidden min-h-[100dvh] flex-col md:flex">
        {/* Desktop navbar */}
        <header
          className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md"
          style={{ borderColor: "#E5EDFF" }}
        >
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <img src={companyLogo} alt="Logo" className="h-11 w-auto object-contain" />
              <div>
                <img src={companyName} alt="Medergency" className="h-6 w-auto object-contain" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Life Deserves Care</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate({ to: "/patient/login" })}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
              >
                Patient Login
              </button>
              <button
                onClick={() => navigate({ to: "/doctor/login" })}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors"
              >
                Doctor Portal
              </button>
              <button
                onClick={() => navigate({ to: "/patient/register" })}
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}
              >
                Get Started →
              </button>
            </div>
          </div>
        </header>

        {/* Desktop Hero */}
        <main className="flex-1 overflow-hidden">
          <section className="relative flex min-h-[calc(100dvh-80px)] items-center">
            {/* Background gradient */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: "linear-gradient(135deg, #EEF2FF 0%, #F0F9FF 50%, #EDE9FE 100%)",
              }}
            />
            {/* Background glows */}
            <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full blur-[120px]" style={{ background: "rgba(37,99,235,0.12)" }} />
            <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full blur-[100px]" style={{ background: "rgba(124,58,237,0.1)" }} />

            <div className="mx-auto grid max-w-7xl items-center gap-16 px-8 lg:grid-cols-2">
              {/* Left: Text + Role cards */}
              <div>
                <div
                  className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold"
                  style={{ borderColor: "#BFDBFE", background: "#EFF6FF", color: "#2563EB" }}
                >
                  <ShieldCheck size={14} />
                  Fast. Trusted. Always. — Verified Doctors
                </div>

                <h1
                  className="text-5xl font-extrabold leading-tight lg:text-6xl"
                  style={{ color: "#111827" }}
                >
                  Your Health,<br />
                  <span style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Our Priority.
                  </span>
                </h1>

                <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: "#6B7280" }}>
                  Consult verified doctors, get prescriptions, book video calls — all in minutes from your phone or laptop.
                </p>

                {/* Desktop Role Cards */}
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {/* Patient */}
                  <button
                    onClick={() => navigate({ to: "/patient/login" })}
                    className="group flex flex-col rounded-3xl bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl border"
                    style={{ borderColor: "#E5EDFF" }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "#EFF6FF" }}>
                      <UserRound size={24} style={{ color: "#2563EB" }} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold" style={{ color: "#111827" }}>I am a Patient</h3>
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                      Find top-rated specialists, book appointments, and get prescriptions online.
                    </p>
                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate({ to: "/patient/register" }); }}
                        className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white shadow-sm"
                        style={{ background: "#2563EB" }}
                      >
                        Register
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate({ to: "/patient/login" }); }}
                        className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-[#2563EB] hover:text-[#2563EB]"
                        style={{ borderColor: "#E5E7EB", color: "#374151" }}
                      >
                        Log In
                      </button>
                    </div>
                  </button>

                  {/* Doctor */}
                  <button
                    onClick={() => navigate({ to: "/doctor/login" })}
                    className="group flex flex-col rounded-3xl bg-gradient-to-b from-[#1E1B4B] to-[#312E81] p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-purple-200">
                      <Stethoscope size={24} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">I am a Doctor</h3>
                    <p className="mt-1 text-sm leading-relaxed text-purple-200">
                      Manage consultations, help patients, and grow your clinical practice.
                    </p>
                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate({ to: "/doctor/onboarding" }); }}
                        className="flex-1 rounded-xl py-2.5 text-sm font-bold shadow-sm"
                        style={{ background: "#7C3AED", color: "white" }}
                      >
                        Join Now
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate({ to: "/doctor/login" }); }}
                        className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                      >
                        Log In
                      </button>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right: Doctor photo + floating badges */}
              <div className="relative flex justify-center">
                <div
                  className="relative overflow-hidden rounded-[2.5rem] shadow-2xl"
                  style={{
                    background: "linear-gradient(160deg, #2563EB 0%, #1D4ED8 60%, #1E3A8A 100%)",
                    padding: "3px",
                  }}
                >
                  <img
                    src={doctorImg}
                    alt="Verified Doctor"
                    className="aspect-[3/4] w-72 rounded-[2.4rem] object-cover"
                  />
                </div>

                {/* Badge: Verified */}
                <div className="absolute -left-6 top-12 flex items-center gap-2.5 rounded-2xl border bg-white p-3 shadow-xl" style={{ borderColor: "#E5EDFF" }}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "#EFF6FF" }}>
                    <ShieldCheck size={18} style={{ color: "#2563EB" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Verified Doctors</p>
                    <p className="text-[10px] text-gray-400">NMC Registered</p>
                  </div>
                </div>

                {/* Badge: Video Call */}
                <div className="absolute -right-4 bottom-16 flex items-center gap-2.5 rounded-2xl border bg-white p-3 shadow-xl" style={{ borderColor: "#EDE9FE" }}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "#F5F3FF" }}>
                    <Video size={18} style={{ color: "#7C3AED" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Instant Video Call</p>
                    <p className="text-[10px] text-gray-400">Connect in minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Desktop footer */}
        <footer className="border-t py-6 text-center text-xs text-gray-400" style={{ borderColor: "#E5EDFF" }}>
          <div className="mx-auto flex max-w-7xl items-center justify-between px-8">
            <span>© 2026 Medergency — Life Deserves Care</span>
            <span>Prototype · All rights reserved</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
