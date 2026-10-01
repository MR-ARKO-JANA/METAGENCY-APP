import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorPhoto, PageTitle, Panel, StatusPill, formatDate } from "@/components/medergency/ui";
import { SlotPicker } from "@/components/medergency/SlotPicker";
import { getDoctor, joinWindow, useMedergency, useNow } from "@/lib/medergency/store";
import type { Appointment } from "@/lib/medergency/types";

export const Route = createFileRoute("/patient/appointments")({
  head: () => ({
    meta: [
      { title: "My Appointments | Medergency" },
      { name: "description", content: "View, reschedule, cancel and join your consultations." },
      { property: "og:title", content: "My Appointments | Medergency" },
      {
        property: "og:description",
        content: "Manage your upcoming, completed and cancelled appointments.",
      },
    ],
  }),
  component: Appointments,
});

type Tab = "upcoming" | "completed" | "cancelled";

function Appointments() {
  const { appointments, currentPatient, updateAppointment } = useMedergency();
  const now = useNow(15000);
  const [tab, setTab] = useState<Tab>("upcoming");
  const [details, setDetails] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState<Appointment | null>(null);
  const [resched, setResched] = useState<Appointment | null>(null);
  const [confirmResched, setConfirmResched] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const mine = appointments.filter((a) => a.patientId === currentPatient?.id);
  const lists: Record<Tab, Appointment[]> = {
    upcoming: mine
      .filter((a) => a.status === "pending" || a.status === "confirmed")
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    completed: mine.filter((a) => a.status === "completed"),
    cancelled: mine.filter((a) => a.status === "cancelled" || a.status === "rejected"),
  };

  const doCancel = () => {
    if (!cancelling) return;
    updateAppointment(
      cancelling.id,
      {
        status: "cancelled",
        payment: cancelling.payment === "paid" ? "refunded" : cancelling.payment,
      },
      {
        userId: currentPatient!.id,
        title: "Appointment cancelled",
        body: `${cancelling.id} was cancelled. Simulated refund initiated.`,
      },
    );
    toast.success("Appointment cancelled");
    setCancelling(null);
  };
  const doResched = () => {
    if (!resched) return;
    updateAppointment(
      resched.id,
      { date: newDate, time: newTime, status: "pending" },
      {
        userId: currentPatient!.id,
        title: "Appointment rescheduled",
        body: `${resched.id} moved to ${formatDate(newDate)} at ${newTime}. Awaiting doctor confirmation.`,
      },
    );
    toast.success("Appointment rescheduled");
    setConfirmResched(false);
    setResched(null);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between animate-fade-in-down">
        <div>
          <h1 className="text-2xl font-black text-slate-800">My Appointments</h1>
          <p className="mt-1 text-sm text-slate-500">Track all your consultations in one place</p>
        </div>
        <Button
          asChild
          className="rounded-xl font-bold shadow-md btn-ripple"
          style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "white" }}
        >
          <Link to="/patient/doctors">+ Book new</Link>
        </Button>
      </div>
      <div className="mb-4 flex gap-2 animate-fade-in-up delay-75">
        {(["upcoming", "completed", "cancelled"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="rounded-full px-4 py-1.5 text-sm font-bold transition-all capitalize"
            style={{
              background: tab === t ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "white",
              color: tab === t ? "white" : "#64748b",
              boxShadow: tab === t ? "0 4px 12px rgba(37,99,235,0.25)" : "0 1px 4px rgba(0,0,0,0.06)",
              border: tab === t ? "none" : "1px solid rgba(0,0,0,0.06)",
              transform: tab === t ? "scale(1.05)" : "scale(1)",
            }}
          >
            {t} ({lists[t].length})
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3">
        {lists[tab].length === 0 && (
          <div
            className="rounded-2xl bg-white p-8 text-center animate-scale-in"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" }}
          >
            <p className="text-slate-400 font-medium">No {tab} appointments yet.</p>
          </div>
        )}
        {lists[tab].map((a, idx) => {
          const d = getDoctor(a.doctorId)!;
          const { eligible } = joinWindow(a, now);
          return (
            <div
              key={a.id}
              className="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row sm:items-center transition-all hover:shadow-md"
              style={{
                boxShadow: "0 2px 16px rgba(37,99,235,0.05)",
                border: "1px solid rgba(59,130,246,0.08)",
                animation: `fadeInUp 0.4s ease ${idx * 70}ms both`,
              }}
            >
              <div className="flex flex-1 gap-3">
                <DoctorPhoto doctor={d} size={56} />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{d.name}</p>
                  <p className="text-sm text-primary">{d.specialization}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(a.date)} · {a.time} · {a.type}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <StatusPill status={a.status} />
                    <StatusPill status={a.payment} />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <Button size="sm" variant="outline" onClick={() => setDetails(a)}>
                  View Details
                </Button>
                {tab === "upcoming" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setResched(a);
                        setNewDate("");
                        setNewTime("");
                      }}
                    >
                      Reschedule
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive"
                      onClick={() => setCancelling(a)}
                    >
                      Cancel
                    </Button>
                    {eligible ? (
                      <Button size="sm" asChild>
                        <Link
                          to="/patient/consultation/$appointmentId"
                          params={{ appointmentId: a.id }}
                        >
                          Join Video
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled
                        title="Opens 10 minutes before a confirmed appointment"
                      >
                        Join Video
                      </Button>
                    )}
                  </>
                )}
                {tab === "completed" && (
                  <Button size="sm" asChild>
                    <Link to="/patient/book/$doctorId" params={{ doctorId: d.id }}>
                      Book follow-up
                    </Link>
                  </Button>
                )}
              </div>
            </Panel>
          );
        })}
      </div>

      <Dialog open={!!details} onOpenChange={(o) => !o && setDetails(null)}>
        <DialogContent>
          {details && (
            <>
              <DialogHeader>
                <DialogTitle>Appointment {details.id}</DialogTitle>
                <DialogDescription>
                  {getDoctor(details.doctorId)?.name} · {formatDate(details.date)} at {details.time}
                </DialogDescription>
              </DialogHeader>
              <dl className="grid gap-2 text-sm">
                {(
                  [
                    ["Reason", details.reason],
                    ["Symptoms", details.symptoms],
                    ["Medical history", details.history],
                    ["Reports", details.reports.join(", ")],
                    ["Payment method", details.paymentMethod],
                    ["Consultation summary", details.summary],
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

      <Dialog open={!!resched && !confirmResched} onOpenChange={(o) => !o && setResched(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reschedule appointment</DialogTitle>
            <DialogDescription>
              Choose a new slot with {resched && getDoctor(resched.doctorId)?.name}.
            </DialogDescription>
          </DialogHeader>
          {resched && (
            <SlotPicker
              doctorId={resched.doctorId}
              date={newDate}
              time={newTime}
              onDate={setNewDate}
              onTime={setNewTime}
              excludeId={resched.id}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setResched(null)}>
              Close
            </Button>
            <Button disabled={!newDate || !newTime} onClick={() => setConfirmResched(true)}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmResched} onOpenChange={setConfirmResched}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm reschedule?</AlertDialogTitle>
            <AlertDialogDescription>
              Move to {newDate && formatDate(newDate)} at {newTime}. The doctor will need to confirm
              again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction onClick={doResched}>Reschedule</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!cancelling} onOpenChange={(o) => !o && setCancelling(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel {cancelling?.id}. A simulated refund will be recorded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={doCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
