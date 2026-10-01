import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut, Pencil } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, PageTitle, Panel } from "@/components/medergency/ui";
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
  const rows: [string, keyof typeof form, string][] = [
    ["Full Name", "fullName", "text"],
    ["Email", "email", "email"],
    ["Mobile Number", "mobile", "tel"],
    ["Date of Birth", "dob", "date"],
    ["Address", "address", "text"],
  ];

  return (
    <div className="max-w-2xl">
      <PageTitle
        title="My Profile"
        action={
          !editing && (
            <Button variant="outline" onClick={() => setEditing(true)} className="rounded-xl border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 shadow-sm">
              <Pencil size={14} className="mr-1.5" />
              Edit Profile
            </Button>
          )
        }
      />
      <div
        className="rounded-2xl bg-white p-6 transition-all animate-fade-in-up"
        style={{
          boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {rows.map(([label, key, type]) => (
            <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
              <Label htmlFor={key} className="text-[13px] font-bold text-slate-800">{label}</Label>
              {editing ? (
                <>
                  <Input
                    id={key}
                    type={type}
                    className="mt-1.5 h-10 rounded-xl bg-slate-50 border-0 shadow-inner focus-visible:ring-blue-500/20"
                    value={form[key]}
                    onChange={set(key)}
                  />
                  <FieldError message={errors[key]} />
                </>
              ) : (
                <p className="mt-1 text-[15px] font-medium text-slate-500">
                  {(key === "mobile" ? `+91 ${p.mobile}` : p[key]) || "—"}
                </p>
              )}
            </div>
          ))}
          <div>
            <Label htmlFor="gender" className="text-[13px] font-bold text-slate-800">Gender</Label>
            {editing ? (
              <select
                id="gender"
                value={form.gender}
                onChange={set("gender")}
                className="mt-1.5 h-10 w-full rounded-xl border-0 bg-slate-50 px-3 text-sm shadow-inner focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Prefer not to say</option>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            ) : (
              <p className="mt-1 text-[15px] font-medium text-slate-500">{p.gender || "—"}</p>
            )}
          </div>
        </div>
        {editing && (
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="ghost"
              onClick={() => {
                setEditing(false);
                setErrors({});
              }}
              className="rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button onClick={save} className="rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700">
              Save changes
            </Button>
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4 animate-fade-in-up delay-100">
        <Button variant="outline" asChild className="rounded-xl border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 shadow-sm">
          <Link to="/patient/settings">Password & preferences</Link>
        </Button>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-[15px] font-bold text-red-500 hover:text-red-600 transition-colors bg-transparent border-0"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
