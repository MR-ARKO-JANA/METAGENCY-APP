import { Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Clock3, Languages, Loader2, Star } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useMedergency } from "@/lib/medergency/store";
import type { AppointmentStatus, Doctor, PaymentStatus, Role } from "@/lib/medergency/types";
import companyLogo from "@/assets/signal-2026-09-15-23-14-14-623.png";
import companyName from "@/assets/signal-2026-09-15-23-14-14-623_002.png";

export function Brand({
  compact = false,
  inverse = false,
}: {
  compact?: boolean;
  inverse?: boolean;
}) {
  return (
    <Link
      to="/"
      className={`brand-lockup ${inverse ? "brand-lockup-inverse" : ""} inline-flex items-center gap-3 justify-start`}
      aria-label="Medergency home"
    >
      <img
        src={companyLogo}
        alt="Medergency Logo"
        className={compact ? "h-9 w-9 object-contain" : "h-11 w-11 object-contain"}
      />
      <div className="flex flex-col justify-center text-left">
        <img
          src={companyName}
          alt="Medergency"
          className={`${compact ? "h-5.5" : "h-7"} w-auto object-contain object-left ${
            inverse ? "brightness-0 invert" : ""
          }`}
        />
        {!compact && <small>Life Deserves Care</small>}
      </div>
    </Link>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl bg-white p-4 text-card-foreground sm:p-5 ${className}`}
      style={{
        boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
        border: "1px solid rgba(59,130,246,0.1)",
      }}
    >
      {children}
    </section>
  );
}

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function VerifiedBadge({ doctor }: { doctor: Doctor }) {
  if (doctor.verification === "approved")
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
        style={{ background: "#dcfce7", color: "#16a34a" }}
      >
        <BadgeCheck size={13} />
        Verified
      </span>
    );
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: "#fef3c7", color: "#d97706" }}
    >
      <Clock3 size={12} />
      Pending
    </span>
  );
}

const statusStyles: Record<string, string> = {
  pending: "background:#FFF7ED;color:#C2410C",
  confirmed: "background:#EFF6FF;color:#2563EB",
  completed: "background:#F0FDF4;color:#16A34A",
  cancelled: "background:#FEF2F2;color:#DC2626",
  rejected: "background:#FEF2F2;color:#DC2626",
  paid: "background:#F0FDF4;color:#16A34A",
  failed: "background:#FEF2F2;color:#DC2626",
  unpaid: "background:#F8FAFC;color:#64748B",
  refunded: "background:#F8FAFC;color:#64748B",
};
const statusLabel: Record<string, string> = {
  pending: "Awaiting doctor",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Declined",
  paid: "Paid (test)",
  failed: "Payment failed",
  unpaid: "Unpaid",
  refunded: "Refunded (test)",
};
export function StatusPill({ status }: { status: AppointmentStatus | PaymentStatus }) {
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ ...(Object.fromEntries((statusStyles[status] ?? "").split(";").filter(Boolean).map(s => s.split(":")))) }}
    >
      {statusLabel[status]}
    </span>
  );
}

export function DoctorPhoto({ doctor, size = 64 }: { doctor: Doctor; size?: number }) {
  return (
    <img
      src={doctor.photo}
      alt={`Portrait of ${doctor.name}`}
      width={size}
      height={size}
      loading="lazy"
      className="shrink-0 bg-secondary object-cover object-top"
      style={{ width: size, height: size, borderRadius: 14 }}
    />
  );
}

export function DoctorCard({ doctor, nextSlots }: { doctor: Doctor; nextSlots?: string[] }) {
  const bookable = doctor.verification === "approved";
  return (
    <div
      className="group flex flex-col gap-3 rounded-2xl bg-white p-4 sm:p-5 transition-all hover:-translate-y-0.5"
      style={{
        boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
        border: "1px solid rgba(59,130,246,0.1)",
      }}
    >
      <div className="flex gap-3">
        <DoctorPhoto doctor={doctor} size={72} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-bold text-slate-800">{doctor.name}</h3>
            <VerifiedBadge doctor={doctor} />
          </div>
          <p className="text-sm font-semibold" style={{ color: "#2563eb" }}>{doctor.specialization}</p>
          <p className="truncate text-xs text-slate-400">{doctor.qualifications}</p>
          {bookable && (
            <p className="mt-0.5 text-[11px] text-slate-400">{doctor.registration}</p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 rounded-xl p-2.5 text-center text-xs" style={{ background: "#f8faff" }}>
        <div>
          <strong className="block text-sm font-bold text-slate-700">{doctor.experience} yrs</strong>
          <span className="text-slate-400">Experience</span>
        </div>
        <div>
          <strong className="block text-sm font-bold text-slate-700">₹{doctor.fee}</strong>
          <span className="text-slate-400">Fee</span>
        </div>
        <div>
          {bookable ? (
            <>
              <strong className="flex items-center justify-center gap-0.5 text-sm font-bold" style={{ color: "#f59e0b" }}>
                <Star size={12} className="fill-current" />
                {doctor.sampleRating}
              </strong>
              <span className="text-slate-400">Rating</span>
            </>
          ) : (
            <>
              <strong className="block text-sm font-bold text-slate-700">—</strong>
              <span className="text-slate-400">Rating</span>
            </>
          )}
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-slate-400">
        <Languages size={13} />
        {doctor.languages.join(", ")}
      </p>

      {nextSlots && (
        <div className="flex flex-wrap gap-1.5">
          {nextSlots.length ? (
            nextSlots.slice(0, 4).map((s) => (
              <span
                key={s}
                className="rounded-lg px-2.5 py-1 text-[11px] font-medium"
                style={{ background: "#eff6ff", color: "#2563eb" }}
              >
                {s}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">
              {bookable ? "No slots available soon" : "Not available for booking yet"}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          asChild
          className="rounded-xl border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Link to="/patient/doctors/$doctorId" params={{ doctorId: doctor.id }}>
            View Profile
          </Link>
        </Button>
        {bookable ? (
          <Button
            asChild
            className="rounded-xl font-bold text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
          >
            <Link to="/patient/book/$doctorId" params={{ doctorId: doctor.id }}>
              Book
            </Link>
          </Button>
        ) : (
          <Button disabled className="rounded-xl">Unavailable</Button>
        )}
      </div>
    </div>
  );
}

export function FullLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <Loader2 className="animate-spin text-primary" />
    </div>
  );
}

/** Client-side role gate for the mock session. Replace with server-verified auth when a backend exists. */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { ready, session } = useMedergency();
  const navigate = useNavigate();
  const allowed = ready && session?.role === role;
  useEffect(() => {
    if (!ready || allowed) return;
    if (session)
      navigate({ to: session.role === "patient" ? "/patient" : "/doctor", replace: true });
    else navigate({ to: role === "patient" ? "/patient/login" : "/doctor/login", replace: true });
  }, [ready, allowed, session, role, navigate]);
  if (!allowed) return <FullLoader />;
  return <>{children}</>;
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="min-h-[100dvh] bg-background md:app-stage">
      {/* Mobile: full-screen, no card wrapper */}
      <div className="flex min-h-[100dvh] flex-col px-5 pt-10 pb-8 md:hidden">
        <Brand />
        <h1 className="mt-8 text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6 flex-1">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
      {/* Desktop: centered card */}
      <div className="hidden w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm md:block">
        <Brand />
        <h1 className="mt-6 text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </main>
  );
}

export function FieldError({ message }: { message?: string | undefined }) {
  return message ? <p className="mt-1 text-xs text-destructive">{message}</p> : null;
}

export function formatDate(
  iso: string,
  opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  },
) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d).toLocaleDateString("en-IN", opts);
}
