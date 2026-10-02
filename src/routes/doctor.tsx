import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  History,
  LogOut,
  ShieldCheck,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brand,
  DoctorPhoto,
  Panel,
  RequireRole,
  StatusPill,
  formatDate,
} from "@/components/medergency/ui";
import { CallRoom } from "@/components/medergency/CallRoom";
import { NotificationList } from "@/components/medergency/NotificationList";
import { getDoctor, joinWindow, useMedergency, useNow } from "@/lib/medergency/store";
import type { Appointment } from "@/lib/medergency/types";

export const Route = createFileRoute("/doctor")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Doctor Dashboard | Medergency" },
      {
        name: "description",
        content: "Manage consultation requests, availability and video consultations.",
      },
      { property: "og:title", content: "Doctor Dashboard | Medergency" },
      { property: "og:description", content: "Your Medergency doctor workspace." },
    ],
  }),
  component: () => (
    <RequireRole role="doctor">
      <DoctorDashboard />
    </RequireRole>
  ),
});

type Tab = "requests" | "upcoming" | "history" | "notifications";
const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ALL_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
];

function DoctorDashboard() {
  const {
    session,
    appointments,
    patients,
    notifications,
    availability,
    updateAppointment,
    setAvailability,
    logout,
  } = useMedergency();
  const navigate = useNavigate();
  const now = useNow(15000);
  const doctor = getDoctor(session!.userId)!;
  const [tab, setTab] = useState<Tab>("requests");
  const [details, setDetails] = useState<Appointment | null>(null);
  const [call, setCall] = useState<Appointment | null>(null);
  const av = availability[doctor.id] ?? { weekdays: [], slots: [] };
  const [days, setDays] = useState<number[]>(av.weekdays);
  const [slots, setSlots] = useState<string[]>(av.slots);

  const mine = appointments.filter((a) => a.doctorId === doctor.id);
  const patient = (id: string) => patients.find((p) => p.id === id);
  const lists = {
    requests: mine.filter((a) => a.status === "pending"),
    upcoming: mine
      .filter((a) => a.status === "confirmed")
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    history: mine.filter((a) => ["completed", "rejected", "cancelled"].includes(a.status)),
  };
  const unread = notifications.filter((n) => n.userId === doctor.id && !n.read).length;
  const signOut = () => {
    logout();
    navigate({ to: "/", replace: true });
  };

  if (call) {
    const p = patient(call.patientId);
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="mx-auto max-w-5xl">
          <CallRoom
            remoteName={p?.fullName ?? "Patient"}
            selfLabel={doctor.name}
            waitingFor={p?.fullName ?? "the patient"}
            onEnd={() => {
              updateAppointment(
                call.id,
                {
                  status: "completed",
                  summary: "Consultation completed. Doctor notes to be added.",
                },
                {
                  userId: call.patientId,
                  title: "Consultation completed",
                  body: `Your consultation with ${doctor.name} is complete.`,
                },
              );
              toast.success("Consultation completed");
              setCall(null);
              setTab("history");
            }}
          />
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Incoming calls", value: lists.requests.length, icon: ClipboardList, color: "#2563eb", grad: "linear-gradient(135deg,#2563eb,#1d4ed8)" },
    { label: "Active calls", value: lists.upcoming.length, icon: CalendarClock, color: "#7c3aed", grad: "linear-gradient(135deg,#8b5cf6,#7c3aed)" },
    { label: "Completed", value: mine.filter((a) => a.status === "completed").length, icon: CheckCircle2, color: "#16a34a", grad: "linear-gradient(135deg,#22c55e,#16a34a)" },
    { label: "Unread alerts", value: unread, icon: Bell, color: "#d97706", grad: "linear-gradient(135deg,#f59e0b,#d97706)" },
  ];

  const Row = ({ a }: { a: Appointment }) => {
    const p = patient(a.patientId);
    const { eligible } = joinWindow(a, now);
    return (
      <div
        className="flex flex-wrap items-center gap-2 rounded-xl p-3 transition-colors hover:bg-slate-50"
        style={{ border: "1px solid rgba(59,130,246,0.1)" }}
      >
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800">{p?.fullName ?? "Patient"}</p>
          <p className="text-xs text-slate-400">
            {formatDate(a.date)} · {a.time} · {a.reason}
          </p>
        </div>
        <StatusPill status={a.status} />
        <Button size="sm" variant="outline" onClick={() => setDetails(a)}>
          Patient details
        </Button>
        {a.status === "pending" && (
          <>
            <Button
              size="sm"
              onClick={() => {
                updateAppointment(
                  a.id,
                  { status: "confirmed" },
                  {
                    userId: a.patientId,
                    title: "Call accepted",
                    body: `${doctor.name} accepted your call.`,
                  },
                );
                toast.success("Call accepted");
              }}
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive"
              onClick={() => {
                updateAppointment(
                  a.id,
                  { status: "rejected", payment: "refunded" },
                  {
                    userId: a.patientId,
                    title: "Call declined",
                    body: `Your call was declined. Simulated refund issued.`,
                  },
                );
                toast("Call declined");
              }}
            >
              Reject
            </Button>
          </>
        )}
        {a.status === "confirmed" && (
          <Button
            size="sm"
            disabled={!eligible}
            title={eligible ? "" : "Opens 10 minutes before start"}
            onClick={() => {
              setCall(a);
            }}
          >
            <Video size={14} />
            Start video
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "#f0f4ff" }}>
      <header
        className="sticky top-0 z-30"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(59,130,246,0.1)",
          boxShadow: "0 1px 20px rgba(37,99,235,0.06)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Brand compact />
          <div className="flex items-center gap-2">
            <span
              className="hidden rounded-full px-3 py-1 text-xs font-bold sm:inline"
              style={{ background: "#eff6ff", color: "#2563eb" }}
            >
              Doctor Portal
            </span>
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5 rounded-xl hover:bg-red-50 hover:text-red-500">
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto grid max-w-5xl gap-4 p-4 pb-10">

        {/* Doctor profile card */}
        <div
          className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-5"
          style={{ boxShadow: "0 2px 16px rgba(37,99,235,0.07)", border: "1px solid rgba(59,130,246,0.1)" }}
        >
          <DoctorPhoto doctor={doctor} size={72} />
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-xl font-bold text-slate-800">
              {doctor.name}
              <ShieldCheck size={18} style={{ color: "#2563eb" }} />
            </h1>
            <p className="text-sm text-slate-500">
              {doctor.qualifications} · {doctor.specialization}
            </p>
            <p className="text-xs text-slate-400">{doctor.registration}</p>
          </div>
          <div
            className="rounded-xl px-4 py-2.5 text-center"
            style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1px solid #bfdbfe" }}
          >
            <p className="text-xs text-slate-400">Consultation Fee</p>
            <p className="text-lg font-extrabold" style={{ color: "#2563eb" }}>₹{doctor.fee}</p>
          </div>
        </div>
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color, grad }) => (
            <div
              key={label}
              className="flex flex-col gap-2 rounded-2xl bg-white p-4"
              style={{ boxShadow: "0 2px 16px rgba(37,99,235,0.07)", border: "1px solid rgba(59,130,246,0.1)" }}
            >
              <div
                className="grid h-9 w-9 place-items-center rounded-xl text-white shadow-sm"
                style={{ background: grad }}
              >
                <Icon size={17} />
              </div>
              <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList className="h-auto flex-wrap">
            <TabsTrigger value="requests">Incoming Calls ({lists.requests.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Active Calls ({lists.upcoming.length})</TabsTrigger>
            <TabsTrigger value="history">
              <History size={14} />
              History
            </TabsTrigger>
            <TabsTrigger value="notifications">Alerts{unread ? ` (${unread})` : ""}</TabsTrigger>
          </TabsList>
        </Tabs>

        {(tab === "requests" || tab === "upcoming" || tab === "history") && (
          <Panel>
            <div className="grid gap-2">
              {lists[tab].length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing here yet.</p>
              ) : (
                lists[tab].map((a) => <Row key={a.id} a={a} />)
              )}
            </div>
          </Panel>
        )}



        {tab === "notifications" && <NotificationList userId={doctor.id} />}
      </main>

      <Dialog open={!!details} onOpenChange={(o) => !o && setDetails(null)}>
        <DialogContent>
          {details && (
            <>
              <DialogHeader>
                <DialogTitle>{patient(details.patientId)?.fullName}</DialogTitle>
                <DialogDescription>
                  {details.id} · {formatDate(details.date)} at {details.time}
                </DialogDescription>
              </DialogHeader>
              <p className="text-xs text-muted-foreground">
                Only consultation-relevant information is shown.
              </p>
              <dl className="grid gap-2 text-sm">
                {(
                  [
                    ["Reason", details.reason],
                    ["Symptoms", details.symptoms],
                    ["Medical history", details.history],
                    ["Shared reports", details.reports.join(", ")],
                    ["Gender", patient(details.patientId)?.gender],
                  ] as [string, string | undefined][]
                )
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-foreground">{v}</dd>
                    </div>
                  ))}
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={lists.requests.length > 0} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-sm text-center [&>button]:hidden">
          {lists.requests[0] && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="animate-pulse rounded-full p-5" style={{ background: "rgba(37, 99, 235, 0.1)" }}>
                <Video size={32} style={{ color: "#2563eb" }} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Incoming Video Call</DialogTitle>
                <DialogDescription className="mt-2 text-base text-slate-800">
                  <span className="font-semibold">{patient(lists.requests[0].patientId)?.fullName}</span> is calling...
                </DialogDescription>
              </div>
              <div className="mt-4 flex w-full gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                  onClick={() => {
                    updateAppointment(
                      lists.requests[0]!.id,
                      { status: "rejected", payment: "refunded" },
                      {
                        userId: lists.requests[0]!.patientId,
                        title: "Call declined",
                        body: `Your call was declined. Simulated refund issued.`,
                      }
                    );
                  }}
                >
                  Decline
                </Button>
                <Button
                  className="flex-1 font-bold text-white shadow-md hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}
                  onClick={() => {
                    const req = lists.requests[0]!;
                    updateAppointment(
                      req.id,
                      { status: "confirmed" },
                      {
                        userId: req.patientId,
                        title: "Call accepted",
                        body: `${doctor.name} accepted your call.`,
                      }
                    );
                    setCall(req);
                  }}
                >
                  Accept
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
