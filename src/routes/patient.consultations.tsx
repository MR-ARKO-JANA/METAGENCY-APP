import { createFileRoute, Link } from "@tanstack/react-router";
import { Video, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoctorPhoto, formatDate } from "@/components/medergency/ui";
import { getDoctor, joinWindow, useMedergency, useNow } from "@/lib/medergency/store";

export const Route = createFileRoute("/patient/consultations")({
  head: () => ({
    meta: [
      { title: "My Consultations | Medergency" },
      { name: "description", content: "Join confirmed video consultations and review past sessions." },
      { property: "og:title", content: "My Consultations | Medergency" },
      { property: "og:description", content: "Your video consultations in one place." },
    ],
  }),
  component: Consultations,
});

function Consultations() {
  const { appointments, currentPatient } = useMedergency();
  const now = useNow(15000);
  const mine = appointments.filter(
    (a) => a.patientId === currentPatient?.id && ["confirmed", "completed"].includes(a.status),
  );

  return (
    <div className="grid gap-5">
      {/* Header */}
      <div className="animate-fade-in-down">
        <h1 className="text-2xl font-black text-slate-800">Consultations</h1>
        <p className="mt-1 text-sm text-slate-500">Your video consultations — confirmed &amp; completed.</p>
      </div>

      {/* Empty state */}
      {mine.length === 0 && (
        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center animate-scale-in"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" }}
        >
          <div
            className="mb-4 grid h-14 w-14 place-items-center rounded-2xl text-white"
            style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
          >
            <Video size={24} />
          </div>
          <p className="font-bold text-slate-700">No consultations yet</p>
          <p className="mt-1 text-sm text-slate-400">Book an appointment to get started</p>
          <Button
            asChild
            className="mt-5 rounded-xl font-bold"
            style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "white" }}
          >
            <Link to="/patient/doctors">Find a Doctor</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-3">
        {mine.map((a, idx) => {
          const d = getDoctor(a.doctorId)!;
          const { eligible } = joinWindow(a, now);
          const isCompleted = a.status === "completed";
          return (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 transition-all hover:shadow-md"
              style={{
                boxShadow: "0 2px 16px rgba(37,99,235,0.05)",
                border: "1px solid rgba(59,130,246,0.08)",
                animation: `fadeInUp 0.4s ease ${idx * 70}ms both`,
              }}
            >
              <DoctorPhoto doctor={d} size={52} />

              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-800">{d.name}</p>
                <p className="text-sm text-slate-500">{d.specialization}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {formatDate(a.date)} · {a.time}
                </p>
              </div>

              {/* Status badge */}
              <span
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  background: isCompleted ? "#f0fdf4" : "#eff6ff",
                  color: isCompleted ? "#16a34a" : "#2563eb",
                }}
              >
                {isCompleted ? (
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Completed</span>
                ) : eligible ? (
                  <span className="flex items-center gap-1 animate-pulse"><Clock size={12} /> Live now</span>
                ) : (
                  <span className="flex items-center gap-1"><Clock size={12} /> Confirmed</span>
                )}
              </span>

              <Button
                size="sm"
                asChild
                className="rounded-xl font-bold"
                style={
                  !isCompleted && eligible
                    ? { background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "white" }
                    : {}
                }
              >
                <Link
                  to="/patient/consultation/$appointmentId"
                  params={{ appointmentId: a.id }}
                  className="flex items-center gap-1"
                >
                  {isCompleted ? "View summary" : eligible ? "Join now" : "Open"}
                  <ArrowRight size={13} />
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
