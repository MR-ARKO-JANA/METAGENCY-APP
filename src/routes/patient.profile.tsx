import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  ClipboardList,
  Heart,
  HelpCircle,
  LogOut,
  Pencil,
  Settings,
  User,
  Video,
  X,
  Check,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/medergency/ui";
import { useSignOut } from "@/components/medergency/PatientShell";
import { useMedergency } from "@/lib/medergency/store";

export const Route = createFileRoute("/patient/profile")({
  head: () => ({
    meta: [
      { title: "My Profile | Medergency" },
      { name: "description", content: "View and update your personal information." },
      { property: "og:title", content: "My Profile | Medergency" },
      { property: "og:description", content: "Manage your Medergency patient profile." },
    ],
  }),
  component: Profile,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit number"),
  dob: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().trim().max(250).optional(),
});

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Profile() {
  const { currentPatient, updateProfile } = useMedergency();
  const signOut = useSignOut();
  const p = currentPatient!;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: p.fullName,
    email: p.email,
    mobile: p.mobile,
    dob: p.dob ?? "",
    gender: p.gender ?? "",
    address: p.address ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    const r = schema.safeParse(form);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    updateProfile(r.data);
    setEditing(false);
    toast.success("Profile updated");
  };

  const menuItems = [
    { icon: User, label: "Personal Information", to: "#personal", action: () => setEditing(true) },
    { icon: ClipboardList, label: "Medical History", to: "/patient/records" },
    { icon: Video, label: "My Consultations", to: "/patient/consultations" },
    { icon: Heart, label: "Saved Doctors", to: "/patient/doctors" },
    { icon: Settings, label: "Settings", to: "/patient/settings" },
    { icon: HelpCircle, label: "Help & Support", to: "#" },
  ];

  return (
    <div className="mx-auto max-w-md grid gap-4">

      {/* ── Avatar card ── */}
      <div
        className="relative rounded-3xl bg-white p-6 text-center animate-fade-in-up"
        style={{ boxShadow: "0 4px 24px rgba(37,99,235,0.10)", border: "1px solid rgba(59,130,246,0.10)" }}
      >
        {/* Edit button */}
        <button
          onClick={() => setEditing(!editing)}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-blue-600 transition-all hover:bg-blue-50"
        >
          <Pencil size={15} />
        </button>

        {/* Avatar circle */}
        <div
          className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-full text-2xl font-black text-white shadow-lg"
          style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
        >
          {getInitials(p.fullName)}
        </div>

        <h1 className="text-xl font-black text-slate-800">{p.fullName}</h1>
        <p className="mt-0.5 text-sm font-medium text-slate-500">+91 {p.mobile}</p>
        <p className="text-xs text-slate-400">{p.email}</p>
      </div>

      {/* ── Edit form (shown when editing) ── */}
      {editing && (
        <div
          className="rounded-2xl bg-white p-5 animate-scale-in"
          style={{ boxShadow: "0 2px 16px rgba(37,99,235,0.07)", border: "1px solid rgba(59,130,246,0.10)" }}
        >
          <h2 className="mb-4 text-[17px] font-black text-slate-800">Edit Personal Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["Full Name", "fullName", "text"],
                ["Mobile Number", "mobile", "tel"],
                ["Email", "email", "email"],
                ["Date of Birth", "dob", "date"],
                ["Address", "address", "text"],
              ] as [string, keyof typeof form, string][]
            ).map(([label, key, type]) => (
              <div key={key} className={key === "address" || key === "email" ? "sm:col-span-2" : ""}>
                <Label htmlFor={key} className="text-[13px] font-bold text-slate-700">{label}</Label>
                <Input
                  id={key}
                  type={type}
                  className="mt-1.5 h-10 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-blue-500/20"
                  value={form[key]}
                  onChange={set(key)}
                />
                <FieldError message={errors[key]} />
              </div>
            ))}
            <div>
              <Label htmlFor="gender" className="text-[13px] font-bold text-slate-700">Gender</Label>
              <select
                id="gender"
                value={form.gender}
                onChange={set("gender")}
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Prefer not to say</option>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              onClick={() => { setEditing(false); setErrors({}); }}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={save}
              className="flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-bold text-white shadow-md btn-ripple"
              style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
            >
              <Check size={14} /> Save changes
            </button>
          </div>
        </div>
      )}

      {/* ── Menu items ── */}
      <div
        className="rounded-2xl bg-white overflow-hidden animate-fade-in-up delay-100"
        style={{ boxShadow: "0 2px 16px rgba(37,99,235,0.07)", border: "1px solid rgba(59,130,246,0.10)" }}
      >
        {menuItems.map(({ icon: Icon, label, to, action }, i) => (
          <div key={label}>
            {action ? (
              <button
                onClick={action}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-all hover:bg-blue-50/60 active:bg-blue-50"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                  style={{ background: "#eff6ff", color: "#2563eb" }}
                >
                  <Icon size={17} />
                </div>
                <span className="flex-1 text-[15px] font-semibold text-slate-700">{label}</span>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            ) : (
              <Link
                to={to as any}
                className="flex items-center gap-4 px-5 py-4 transition-all hover:bg-blue-50/60 active:bg-blue-50"
              >
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                  style={{ background: "#eff6ff", color: "#2563eb" }}
                >
                  <Icon size={17} />
                </div>
                <span className="flex-1 text-[15px] font-semibold text-slate-700">{label}</span>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
            )}
            {i < menuItems.length - 1 && (
              <div className="mx-5 h-px bg-slate-100" />
            )}
          </div>
        ))}
      </div>

      {/* ── Logout ── */}
      <button
        onClick={signOut}
        className="flex w-full items-center gap-4 rounded-2xl bg-white px-5 py-4 transition-all hover:bg-red-50 animate-fade-in-up delay-200"
        style={{ boxShadow: "0 2px 16px rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.10)" }}
      >
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500">
          <LogOut size={17} />
        </div>
        <span className="flex-1 text-[15px] font-bold text-red-500">Logout</span>
        <ChevronRight size={16} className="text-red-300" />
      </button>
    </div>
  );
}
