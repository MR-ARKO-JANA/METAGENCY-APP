import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  FolderHeart,
  Home,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Stethoscope,
  UserRound,
  Video,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useMedergency } from "@/lib/medergency/store";
import { Brand } from "./ui";

const side = [
  { to: "/patient", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/patient/doctors", label: "Find Doctors", icon: Stethoscope },
  { to: "/patient/appointments", label: "My Appointments", icon: CalendarDays },
  { to: "/patient/consultations", label: "Consultations", icon: Video },
  { to: "/patient/records", label: "Medical Records", icon: FolderHeart },
  { to: "/patient/notifications", label: "Notifications", icon: Bell },
  { to: "/patient/profile", label: "My Profile", icon: UserRound },
  { to: "/patient/settings", label: "Settings", icon: Settings },
] as const;
const bottom = [
  { to: "/patient", label: "Home", icon: Home, exact: true },
  { to: "/patient/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/patient/appointments", label: "Appointments", icon: ClipboardList },
  { to: "/patient/records", label: "Records", icon: FolderHeart },
  { to: "/patient/profile", label: "Profile", icon: UserRound },
] as const;

export function useSignOut() {
  const { logout } = useMedergency();
  const navigate = useNavigate();
  return () => {
    logout();
    navigate({ to: "/", replace: true });
  };
}

export function PatientShell({ children }: { children: ReactNode }) {
  const { currentPatient, notifications, session } = useMedergency();
  const navigate = useNavigate();
  const signOut = useSignOut();
  const [q, setQ] = useState("");
  const unread = notifications.filter((n) => n.userId === session?.userId && !n.read).length;
  const initials = (currentPatient?.fullName ?? "P")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="min-h-screen" style={{ background: "#f0f4ff" }}>
      {/* ── Top Header ── */}
      <header
        className="sticky top-0 z-30"
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(59,130,246,0.1)",
          boxShadow: "0 1px 20px rgba(37,99,235,0.06)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Brand compact />
          <form
            className="relative mx-auto hidden max-w-md flex-1 md:block"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/patient/doctors", search: { q } });
            }}
          >
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={16}
              style={{ color: "#94a3b8" }}
            />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search doctors, specialties..."
              className="pl-9 rounded-xl border-0 bg-slate-100 text-foreground focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
              aria-label="Search doctors"
            />
          </form>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <Link
              to="/patient/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-blue-50"
              aria-label={`Notifications, ${unread} unread`}
            >
              <Bell size={19} className="text-slate-600" />
              {unread > 0 && (
                <span
                  className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold text-white"
                  style={{ background: "#ef4444" }}
                >
                  {unread}
                </span>
              )}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full px-1 py-1 hover:bg-blue-50 transition-all">
                <span
                  className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white shadow-sm"
                  style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
                >
                  {initials}
                </span>
                <span className="hidden text-sm font-semibold text-slate-700 sm:inline pr-1">
                  {currentPatient?.fullName}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-xl border-0" style={{ boxShadow: "0 20px 60px rgba(37,99,235,0.15)" }}>
                <DropdownMenuLabel className="truncate text-slate-500 font-normal">{currentPatient?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate({ to: "/patient/profile" })} className="rounded-lg">
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate({ to: "/patient/settings" })} className="rounded-lg">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={signOut} className="text-red-500 rounded-lg">
                  <LogOut size={15} />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-24 pt-5 lg:pb-10">
        {/* ── Sidebar ── */}
        <aside className="sticky top-21 hidden h-fit w-60 shrink-0 lg:block">
          <nav
            className="flex flex-col gap-0.5 rounded-2xl p-3"
            style={{
              background: "white",
              boxShadow: "0 4px 24px rgba(37,99,235,0.08)",
              border: "1px solid rgba(59,130,246,0.1)",
            }}
          >
            {side.map(({ to, label, icon: Icon, ...rest }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: "exact" in rest }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all hover:bg-blue-50 hover:text-blue-600"
                activeProps={{
                  className: "rounded-xl px-3 py-2.5 text-sm font-semibold flex items-center gap-3 transition-all",
                  style: {
                    background: "linear-gradient(135deg, #2563eb15, #7c3aed10)",
                    color: "#2563eb",
                    borderLeft: "3px solid #2563eb",
                  },
                }}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <div className="my-2 border-t border-slate-100" />
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-400 transition-all hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 lg:hidden"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(59,130,246,0.1)",
          boxShadow: "0 -4px 20px rgba(37,99,235,0.08)",
        }}
      >
        {bottom.map(({ to, label, icon: Icon, ...rest }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: "exact" in rest }}
            className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-slate-400 transition-all"
            activeProps={{ className: "flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold text-blue-600" }}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
