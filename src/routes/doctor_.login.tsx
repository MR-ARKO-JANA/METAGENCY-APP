import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell, FieldError } from "@/components/medergency/ui";
import { useMedergency } from "@/lib/medergency/store";
import { DEMO_DOCTOR_EMAIL, DEMO_PASSWORD } from "@/lib/medergency/mock-data";

export const Route = createFileRoute("/doctor_/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Doctor Login | Medergency" },
      { name: "description", content: "Doctors log in to manage consultations on Medergency." },
      { property: "og:title", content: "Doctor Login | Medergency" },
      {
        property: "og:description",
        content: "Access your doctor dashboard and consultation requests.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DoctorLogin,
});

function DoctorLogin() {
  const { loginDoctor } = useMedergency();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotRegistered(false);
    if (!/\S+@\S+\.\S+/.test(email) || !password) {
      setError("Enter your registered email and password.");
      return;
    }
    const res = loginDoctor(email, password);
    if (res.ok) {
      navigate({ to: "/doctor", replace: true });
      return;
    }
    if (res.error === "not_registered") {
      setError("");
      setNotRegistered(true);
      return;
    }
    setError(res.error);
  };

  return (
    <AuthShell
      title="Doctor login"
      subtitle="Manage your consultations and availability."
    >
      <form onSubmit={submit} className="grid gap-4" noValidate>
        <div>
          <Label htmlFor="email">Registered Email</Label>
          <Input
            id="email"
            type="email"
            className="mt-1.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="pw">Password</Label>
          <Input
            id="pw"
            type="password"
            className="mt-1.5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FieldError message={error} />
        </div>
        {notRegistered && (
          <div className="rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">
            No doctor account found for this email. Complete onboarding and verification first.
            <Button
              className="mt-3 w-full"
              onClick={() => navigate({ to: "/doctor/onboarding" })}
              type="button"
            >
              Start Doctor Onboarding
            </Button>
          </div>
        )}
        <Button type="submit" size="lg">
          Login
        </Button>
        <div className="text-center text-sm text-muted-foreground mt-2 mb-2">
          Not registered yet?{" "}
          <Link to="/doctor/onboarding" className="font-semibold text-primary">
            Join as Doctor
          </Link>
          <div className="mt-2">
            Are you a patient?{" "}
            <Link to="/patient/login" className="font-semibold text-primary">
              Patient login
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setEmail(DEMO_DOCTOR_EMAIL);
            setPassword(DEMO_PASSWORD);
          }}
          className="rounded-lg border border-dashed p-3 text-left text-xs text-muted-foreground hover:bg-muted"
        >
          <strong className="text-foreground">Demo doctor:</strong> {DEMO_DOCTOR_EMAIL} /{" "}
          {DEMO_PASSWORD} — tap to fill
        </button>

        <div className="relative mt-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or continue with</span>
          </div>
        </div>

        <div className="mt-2 flex justify-center gap-4">
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
            aria-label="Continue with Google"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
            aria-label="Continue with Apple"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="black">
              <path d="M16.365 7.15c.616-.763 1.025-1.802.905-2.847-.872.036-1.98.59-2.617 1.344-.566.66-.99 1.706-.861 2.722.956.074 1.963-.453 2.573-1.22z" />
              <path d="M16.924 8.78c-1.353-.028-2.6.812-3.238.812-.647 0-1.74-.755-2.858-.735-1.464.02-2.825.86-3.57 2.167-1.528 2.656-.39 6.577 1.11 8.742.723 1.05 1.576 2.213 2.7 2.174 1.096-.038 1.503-.715 2.825-.715 1.3 0 1.69.715 2.823.696 1.15-.02 1.884-1.066 2.6-2.11 1.83-2.662 2.176-5.467 2.197-5.617-.033-.02-2.673-1.026-2.695-4.103-.02-2.585 2.112-3.834 2.22-3.89-1.21-1.767-3.08-2.008-3.765-2.062z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-primary bg-[#EFF6FF] text-primary shadow-sm transition-all hover:bg-blue-100 hover:shadow-md"
            aria-label="Continue with Phone"
          >
            <Phone size={20} className="fill-current" />
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
