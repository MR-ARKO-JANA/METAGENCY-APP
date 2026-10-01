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
      {/* Specialist Doctors List */}
      <div className="mt-2 animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Specialist Doctors</h2>
          <Link to="/patient/doctors" className="text-sm font-semibold text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {[
            {
              title: "General Physician",
              desc: "For fever, cold, cough & general health issues",
              icon: Stethoscope,
              bg: "#eff6ff",
              color: "#2563eb"
            },
            {
              title: "Gynecologist",
              desc: "For women's health & menstrual issues",
              icon: FolderHeart,
              bg: "#fdf2f8",
              color: "#db2777"
            },
            {
              title: "Psychiatrist",
              desc: "For stress, anxiety, depression & more",
              icon: UsersRound,
              bg: "#f5f3ff",
              color: "#7c3aed"
            }
          ].map((spec, i) => (
            <Link
              key={spec.title}
              to="/patient/doctors"
              className="flex items-center gap-4 rounded-2xl bg-white p-4 card-hover shadow-sm"
              style={{
                border: "1px solid rgba(0,0,0,0.04)",
                animationDelay: `${(i + 2) * 100}ms`
              }}
            >
              <div
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
                style={{ background: spec.bg, color: spec.color }}
              >
                <spec.icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">{spec.title}</h3>
                <p className="text-xs text-slate-500 truncate mt-0.5">{spec.desc}</p>
              </div>
              <ChevronRight size={18} className="text-slate-400 shrink-0" />
            </Link>
          ))}
        </div>
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
