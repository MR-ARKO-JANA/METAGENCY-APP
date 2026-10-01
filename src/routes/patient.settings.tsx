import { createFileRoute } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FieldError, PageTitle, Panel } from "@/components/medergency/ui";
import { useSignOut } from "@/components/medergency/PatientShell";
import { useMedergency } from "@/lib/medergency/store";

export const Route = createFileRoute("/patient/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Medergency" },
      {
        name: "description",
        content: "Change your password, notification and privacy preferences.",
      },
      { property: "og:title", content: "Settings | Medergency" },
      { property: "og:description", content: "Manage your Medergency account settings." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { changePassword } = useMedergency();
  const signOut = useSignOut();
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [err, setErr] = useState("");
  const [prefs, setPrefs] = useState({
    "Appointment reminders": true,
    "Booking & payment updates": true,
    "Health tips & offers": false,
  });
  const [privacy, setPrivacy] = useState({
    "Share my records with doctors I book": true,
    "Allow anonymised usage analytics": false,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next.length < 8) return setErr("New password must be at least 8 characters.");
    if (pw.next !== pw.confirm) return setErr("Passwords do not match.");
    const r = changePassword(pw.current, pw.next);
    if (!r.ok) return setErr(r.error);
    setErr("");
    setPw({ current: "", next: "", confirm: "" });
    toast.success("Password changed");
  };

  return (
    <div className="grid max-w-2xl gap-4">
      <PageTitle title="Settings" />
      <div
        className="rounded-2xl bg-white p-6 transition-all animate-fade-in-up"
        style={{
          boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <h2 className="mb-4 text-[17px] font-bold text-slate-800">Change password</h2>
        <form onSubmit={submit} className="grid gap-4">
          {(["current", "next", "confirm"] as const).map((k) => (
            <div key={k}>
              <Label htmlFor={k} className="text-[13px] font-bold text-slate-800">
                {k === "current"
                  ? "Current password"
                  : k === "next"
                    ? "New password"
                    : "Confirm new password"}
              </Label>
              <Input
                id={k}
                type="password"
                className="mt-1.5 h-10 rounded-xl bg-slate-50 border-0 shadow-inner focus-visible:ring-blue-500/20"
                value={pw[k]}
                onChange={(e) => setPw({ ...pw, [k]: e.target.value })}
              />
            </div>
          ))}
          <FieldError message={err} />
          <Button type="submit" className="w-fit rounded-xl bg-blue-600 font-bold text-white shadow-md hover:bg-blue-700 mt-2">
            Update password
          </Button>
        </form>
      </div>
      <div
        className="rounded-2xl bg-white p-6 transition-all animate-fade-in-up delay-75"
        style={{
          boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <h2 className="mb-4 text-[17px] font-bold text-slate-800">Notification preferences</h2>
        <div className="grid gap-1">
          {Object.entries(prefs).map(([k, v]) => (
            <label key={k} className="flex items-center justify-between py-2 text-[14px] font-medium text-slate-700 cursor-pointer">
              {k}
              <Switch
                checked={v}
                onCheckedChange={(c) => {
                  setPrefs({ ...prefs, [k]: c });
                  toast.success("Preference saved");
                }}
              />
            </label>
          ))}
        </div>
      </div>
      <div
        className="rounded-2xl bg-white p-6 transition-all animate-fade-in-up delay-150"
        style={{
          boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <h2 className="mb-4 text-[17px] font-bold text-slate-800">Privacy</h2>
        <div className="grid gap-1">
          {Object.entries(privacy).map(([k, v]) => (
            <label key={k} className="flex items-center justify-between py-2 text-[14px] font-medium text-slate-700 cursor-pointer">
              {k}
              <Switch
                checked={v}
                onCheckedChange={(c) => {
                  setPrivacy({ ...privacy, [k]: c });
                  toast.success("Privacy setting saved");
                }}
              />
            </label>
          ))}
        </div>
      </div>
      <Button variant="outline" className="w-fit text-destructive" onClick={signOut}>
        <LogOut size={15} />
        Logout
      </Button>
    </div>
  );
}
