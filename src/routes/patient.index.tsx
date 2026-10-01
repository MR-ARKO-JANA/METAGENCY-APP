import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FolderHeart,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { DoctorCard, DoctorPhoto, StatusPill, formatDate } from "@/components/medergency/ui";
import { DoctorFilters, applyFilters, emptyFilters } from "@/components/medergency/DoctorFilters";
import { doctors } from "@/lib/medergency/mock-data";
import { getDoctor, joinWindow, useMedergency, useNow } from "@/lib/medergency/store";
import { nextOpenSlots } from "@/lib/medergency/availability";
import doctorPortrait from "@/assets/doctor-portrait.png";

export const Route = createFileRoute("/patient/")({
  head: () => ({
    meta: [
      { title: "Patient Dashboard | Medergency" },
      { name: "description", content: "Your appointments, consultations and verified doctors in one place." },
      { property: "og:title", content: "Patient Dashboard | Medergency" },
      { property: "og:description", content: "Manage appointments and find verified doctors." },
    ],
  }),
  component: Dashboard,
});

// ── Count-up hook ──────────────────────────────────────────────
function useCountUp(end: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started || end === 0) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return { count: end === 0 ? 0 : count, ref };
}

// ── Scroll-reveal hook ─────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Animated Stat Card ─────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, grad, delay = 0 }: {
  label: string; value: number; icon: React.ElementType;
  color: string; grad: string; delay?: number;
}) {
  const { count, ref } = useCountUp(value, 1000);
  const { ref: revealRef, visible } = useReveal();

  return (
    <div
      ref={(el) => { (ref as React.MutableRefObject<HTMLDivElement | null>).current = el; (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = el; }}
      className="flex flex-col gap-2 rounded-2xl bg-white p-4 card-hover"
      style={{
        boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
        border: "1px solid rgba(59,130,246,0.1)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s cubic-bezier(.34,1.56,.64,1) ${delay}ms`,
      }}
    >
      <div
        className="grid h-10 w-10 place-items-center rounded-xl text-white"
        style={{ background: grad, boxShadow: `0 4px 12px ${color}40` }}
      >
        <Icon size={18} />
      </div>
      <p className="text-3xl font-black" style={{ color }}>{count}</p>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}

// ── Specialist Row ─────────────────────────────────────────────
function SpecialistRow({ title, desc, icon: Icon, bg, color, delay = 0 }: {
  title: string; desc: string; icon: React.ElementType; bg: string; color: string; delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <Link
      ref={ref as React.Ref<HTMLAnchorElement>}
      to="/patient/doctors"
      className="group flex items-center gap-4 rounded-2xl bg-white p-4"
      style={{
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-24px)",
        transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms, box-shadow 0.25s ease`,
      }}
    >
      <div
        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
        style={{ background: bg, color }}
      >
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-800 truncate">{title}</h3>
        <p className="text-xs text-slate-400 truncate mt-0.5">{desc}</p>
      </div>
      <ChevronRight
        size={18}
        className="text-slate-300 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        style={{ color }}
      />
    </Link>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────
function Dashboard() {
  const { currentPatient, appointments, availability } = useMedergency();
  const navigate = useNavigate();
  const now = useNow(15000);
  const [filters, setFilters] = useState(emptyFilters);
  const mine = appointments.filter((a) => a.patientId === currentPatient?.id);
  const upcoming = mine
    .filter((a) => a.status === "confirmed" || a.status === "pending")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const featured = useMemo(
    () => applyFilters(doctors, filters, availability, appointments).slice(0, 6),
    [filters, availability, appointments],
  );

  const stats = [
    { label: "Upcoming", value: mine.filter((a) => a.status === "confirmed").length, icon: CalendarDays, color: "#2563eb", grad: "linear-gradient(135deg,#2563eb,#1d4ed8)" },
    { label: "Completed", value: mine.filter((a) => a.status === "completed").length, icon: CheckCircle2, color: "#16a34a", grad: "linear-gradient(135deg,#22c55e,#16a34a)" },
    { label: "Pending", value: mine.filter((a) => a.status === "pending").length, icon: Clock3, color: "#d97706", grad: "linear-gradient(135deg,#f59e0b,#d97706)" },
    { label: "Doctors", value: doctors.filter((d) => d.verification === "approved").length, icon: UsersRound, color: "#7c3aed", grad: "linear-gradient(135deg,#8b5cf6,#7c3aed)" },
  ];

  const specialists = [
    { title: "General Physician", desc: "For fever, cold, cough & general health issues", icon: Stethoscope, bg: "#eff6ff", color: "#2563eb" },
    { title: "Gynecologist", desc: "For women's health & menstrual issues", icon: FolderHeart, bg: "#fdf2f8", color: "#db2777" },
    { title: "Psychiatrist", desc: "For stress, anxiety, depression & more", icon: UsersRound, bg: "#f5f3ff", color: "#7c3aed" },
  ];

  const { ref: heroRef, visible: heroVisible } = useReveal(0.01);
  const { ref: apptRef, visible: apptVisible } = useReveal();

  return (
    <div className="grid gap-6">

      {/* ── Greeting ── */}
      <div className="animate-fade-in-down">
        <h1 className="text-xl font-black text-slate-800 sm:text-2xl">
          Hello, {currentPatient?.fullName.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">How can we help you today?</p>
      </div>

      {/* ── Hero banner (static background + fixed image) ── */}
      <div
        ref={heroRef}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{
          background: "linear-gradient(135deg, #0f2b73 0%, #1e40af 45%, #2563eb 75%, #0f2b73 100%)",
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(.34,1.2,.64,1)",
        }}
      >
        {/* Decorative background orbs (static) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div style={{ position: "absolute", top: "-20%", right: "10%", width: 180, height: 180, borderRadius: "50%", background: "rgba(96,165,250,0.18)" }} />
          <div style={{ position: "absolute", bottom: "-10%", right: "25%", width: 120, height: 120, borderRadius: "50%", background: "rgba(139,92,246,0.15)" }} />
          <div style={{ position: "absolute", top: "30%", left: "55%", width: 60, height: 60, borderRadius: "50%", background: "rgba(34,211,238,0.12)" }} />
        </div>

        <div className="relative z-10 w-3/5 md:w-1/2">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-200" style={{ animation: "fadeInUp 0.5s ease both" }}>
            ✦ Fast · Trusted · Always
          </p>
          <h2
            className="text-2xl font-black leading-tight text-white sm:text-3xl"
            style={{ animation: "fadeInUp 0.6s ease 0.1s both" }}
          >
            Consult a Doctor<br />
            <span style={{ color: "#93c5fd" }}>Connect in Minutes</span>
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-blue-100 sm:text-sm" style={{ animation: "fadeInUp 0.6s ease 0.2s both" }}>
            Book an instant consultation<br />with experienced doctors
          </p>
          <Button
            className="mt-5 rounded-xl bg-white px-7 py-2 font-black text-[#0f2b73] hover:bg-slate-100 btn-ripple animate-pulse-glow"
            onClick={() => navigate({ to: "/patient/doctors" })}
            style={{ animation: "bounceIn 0.7s cubic-bezier(.34,1.56,.64,1) 0.4s both" }}
          >
            Consult Now →
          </Button>
        </div>
        <img
          src={doctorPortrait}
          alt="Doctor"
          className="absolute bottom-0 right-0 h-full w-auto object-contain object-bottom drop-shadow-2xl md:-right-4"
        />
      </div>

      {/* ── Stat cards with count-up ── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 100} />)}
      </div>

      {/* ── Specialist Doctors ── */}
      <div>
        <div className="mb-4 flex items-center justify-between animate-fade-in-up delay-100">
          <h2 className="text-lg font-black text-slate-800">Specialist Doctors</h2>
          <Link to="/patient/doctors" className="text-sm font-bold text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {specialists.map((spec, i) => (
            <SpecialistRow key={spec.title} {...spec} delay={i * 100} />
          ))}
        </div>
      </div>

      {/* ── Upcoming appointments ── */}
      <div
        ref={apptRef}
        className="rounded-2xl bg-white p-5"
        style={{
          boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
          border: "1px solid rgba(59,130,246,0.1)",
          opacity: apptVisible ? 1 : 0,
          transform: apptVisible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-800">Upcoming appointments</h2>
          <Link to="/patient/appointments" className="text-sm font-bold" style={{ color: "#2563eb" }}>
            View all
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-400">
            No upcoming appointments.{" "}
            <Link to="/patient/doctors" className="font-bold" style={{ color: "#2563eb" }}>
              Book one now
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-2">
            {upcoming.slice(0, 3).map((a, i) => {
              const d = getDoctor(a.doctorId)!;
              const { eligible } = joinWindow(a, now);
              return (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl p-3 transition-all duration-300 hover:bg-blue-50 hover:scale-[1.01]"
                  style={{
                    border: "1px solid rgba(59,130,246,0.08)",
                    opacity: apptVisible ? 1 : 0,
                    transform: apptVisible ? "translateX(0)" : "translateX(-20px)",
                    transition: `opacity 0.4s ease ${(i + 2) * 80}ms, transform 0.4s ease ${(i + 2) * 80}ms, background 0.2s, scale 0.2s`,
                  }}
                >
                  <DoctorPhoto doctor={d} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800">{d.name}</p>
                    <p className="text-xs text-slate-400">{formatDate(a.date)} · {a.time}</p>
                  </div>
                  <StatusPill status={a.status} />
                  <Button
                    size="sm"
                    variant={eligible ? "default" : "outline"}
                    asChild
                    className="rounded-lg font-bold btn-ripple"
                    style={eligible ? { background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "white" } : {}}
                  >
                    <Link to="/patient/consultation/$appointmentId" params={{ appointmentId: a.id }}>
                      {eligible ? "Join now" : "Details"}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Featured doctors ── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800">Featured Doctors</h2>
          <Link to="/patient/doctors" className="text-sm font-bold text-blue-600">See all</Link>
        </div>
        <DoctorFilters value={filters} onChange={setFilters} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((d, i) => (
            <div
              key={d.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <DoctorCard
                doctor={d}
                nextSlots={nextOpenSlots(d.id, availability[d.id], appointments)}
              />
            </div>
          ))}
          {featured.length === 0 && (
            <p className="text-sm text-slate-400">No doctors match these filters.</p>
          )}
        </div>
      </section>
    </div>
  );
}
