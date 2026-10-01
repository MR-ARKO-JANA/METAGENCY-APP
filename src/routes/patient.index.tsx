import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  FolderHeart,
  Search,
  Stethoscope,
  UsersRound,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DoctorCard, DoctorPhoto, Panel, StatusPill, formatDate } from "@/components/medergency/ui";
import { DoctorFilters, applyFilters, emptyFilters } from "@/components/medergency/DoctorFilters";
import { doctors } from "@/lib/medergency/mock-data";
import { getDoctor, joinWindow, useMedergency, useNow } from "@/lib/medergency/store";
import { nextOpenSlots } from "@/lib/medergency/availability";
import doctorPortrait from "@/assets/doctor-portrait.png";

export const Route = createFileRoute("/patient/")({
  head: () => ({
    meta: [
      { title: "Patient Dashboard | Medergency" },
      {
        name: "description",
        content: "Your appointments, consultations and verified doctors in one place.",
      },
      { property: "og:title", content: "Patient Dashboard | Medergency" },
      { property: "og:description", content: "Manage appointments and find verified doctors." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { currentPatient, appointments, availability } = useMedergency();
  const navigate = useNavigate();
  const now = useNow(15000);
  const [q, setQ] = useState("");
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
    {
      label: "Upcoming",
      value: mine.filter((a) => a.status === "confirmed").length,
      icon: CalendarDays,
      color: "#2563eb",
      bg: "#eff6ff",
      grad: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    },
    {
      label: "Completed",
      value: mine.filter((a) => a.status === "completed").length,
      icon: CheckCircle2,
      color: "#16a34a",
      bg: "#f0fdf4",
      grad: "linear-gradient(135deg, #22c55e, #16a34a)",
    },
    {
      label: "Pending",
      value: mine.filter((a) => a.status === "pending").length,
      icon: Clock3,
      color: "#d97706",
      bg: "#fffbeb",
      grad: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
    {
      label: "Doctors Available",
      value: doctors.filter((d) => d.verification === "approved").length,
      icon: UsersRound,
      color: "#7c3aed",
      bg: "#f5f3ff",
      grad: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    },
  ];
  const actions = [
    { to: "/patient/doctors", label: "Find a Doctor", icon: Stethoscope, color: "#2563eb", bg: "#eff6ff" },
    { to: "/patient/doctors", label: "Book Appointment", icon: CalendarPlus, color: "#7c3aed", bg: "#f5f3ff" },
    { to: "/patient/consultations", label: "My Consultations", icon: Video, color: "#0891b2", bg: "#ecfeff" },
    { to: "/patient/records", label: "Medical Records", icon: FolderHeart, color: "#e11d48", bg: "#fff1f2" },
  ] as const;

  return (
    <div className="grid gap-5">
      <div className="mb-2 animate-fade-in-down">
        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
          Hello, {currentPatient?.fullName.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">How can we help you today?</p>
      </div>

      <section
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 animate-gradient animate-fade-in-up"
        style={{ background: "linear-gradient(135deg, #0f2b73 0%, #1e40af 40%, #2563eb 70%, #0f2b73 100%)", backgroundSize: "200% 200%" }}
      >
        <div className="relative z-10 w-2/3 md:w-1/2">
          <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">
            Consult a Doctor<br />Connect in Minutes
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-blue-100 sm:text-sm">
            Book an instant consultation<br />with experienced doctors
          </p>
          <Button 
            className="mt-5 rounded-xl bg-white px-6 font-bold text-[#0f2b73] hover:bg-slate-100 shadow-md btn-ripple animate-pulse-glow"
            onClick={() => navigate({ to: "/patient/doctors" })}
          >
            Consult Now
          </Button>
        </div>
        <img
          src={doctorPortrait}
          alt="Doctor"
          className="absolute bottom-0 right-0 h-[110%] w-auto object-contain object-bottom drop-shadow-xl md:-right-5 animate-float-slow"
        />
      </section>

      <form
        className="mt-2 flex max-w-xl flex-col gap-2 sm:flex-row animate-fade-in-up delay-100"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/patient/doctors", search: { q } });
        }}
      >
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search doctors, specialties..."
            className="h-11 rounded-xl bg-card pl-9 text-foreground shadow-sm"
          />
        </div>
        <Button type="submit" variant="default" size="lg" className="h-11 rounded-xl font-bold shadow-sm" style={{ backgroundColor: "#2563eb", color: "white" }}>
          Find a Doctor
        </Button>
      </form>

      {/* Quick action cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {actions.map(({ to, label, icon: Icon, color, bg }, i) => (
          <Link
            key={label}
            to={to}
            className={`group flex flex-col gap-3 rounded-2xl bg-white p-4 card-hover animate-fade-in-up`}
            style={{
              boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
              border: "1px solid rgba(59,130,246,0.1)",
              animationDelay: `${i * 80}ms`,
            }}
          >
            <span
              className="grid h-11 w-11 place-items-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
              style={{ background: bg, color }}
            >
              <Icon size={20} />
            </span>
            <span className="text-sm font-semibold text-slate-700">{label}</span>
          </Link>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, grad }, i) => (
          <div
            key={label}
            className={`flex flex-col gap-2 rounded-2xl p-4 card-hover animate-scale-in`}
            style={{
              background: "white",
              boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
              border: "1px solid rgba(59,130,246,0.1)",
              animationDelay: `${i * 100}ms`,
            }}
          >
            <div
              className="grid h-9 w-9 place-items-center rounded-xl text-white shadow-sm"
              style={{ background: grad }}
            >
              <Icon size={17} />
            </div>
            <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
            <p className="text-xs text-slate-400 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming appointments */}
      <div
        className="rounded-2xl bg-white p-5"
        style={{
          boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
          border: "1px solid rgba(59,130,246,0.1)",
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">Upcoming appointments</h2>
          <Link to="/patient/appointments" className="text-sm font-semibold" style={{ color: "#2563eb" }}>
            View all
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-400">
            No upcoming appointments.{" "}
            <Link to="/patient/doctors" className="font-semibold" style={{ color: "#2563eb" }}>
              Book one now
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-2">
            {upcoming.slice(0, 3).map((a) => {
              const d = getDoctor(a.doctorId)!;
              const { eligible } = joinWindow(a, now);
              return (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50"
                  style={{ border: "1px solid rgba(59,130,246,0.08)" }}
                >
                  <DoctorPhoto doctor={d} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">{d.name}</p>
                    <p className="text-xs text-slate-400">
                      {formatDate(a.date)} · {a.time}
                    </p>
                  </div>
                  <StatusPill status={a.status} />
                  <Button
                    size="sm"
                    variant={eligible ? "default" : "outline"}
                    asChild
                    className="rounded-lg font-semibold"
                    style={eligible ? { background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "white" } : {}}
                  >
                    <Link
                      to="/patient/consultation/$appointmentId"
                      params={{ appointmentId: a.id }}
                    >
                      {eligible ? "Join now" : "Details"}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Featured doctors</h2>
          <Link to="/patient/doctors" className="text-sm font-medium text-primary">
            See all
          </Link>
        </div>
        <DoctorFilters value={filters} onChange={setFilters} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((d) => (
            <DoctorCard
              key={d.id}
              doctor={d}
              nextSlots={nextOpenSlots(d.id, availability[d.id], appointments)}
            />
          ))}
          {featured.length === 0 && (
            <p className="text-sm text-muted-foreground">No doctors match these filters.</p>
          )}
        </div>
      </section>
    </div>
  );
}
