import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowRightIcon, ChevronRight, ShieldCheck, Stethoscope, UserRound, Video, CalendarCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import companyLogo from "@/assets/signal-2026-09-15-23-14-14-623.png";
import companyName from "@/assets/signal-2026-09-15-23-14-14-623_002.png";
import heroDoctor from "@/assets/doctor-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medergency — Online Consultations with Verified Doctors" },
      {
        name: "description",
        content: "Book video consultations with verified doctors, or join Medergency as a doctor. Life Deserves Care.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [step, setStep] = useState<"splash" | "role">("splash");
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground">
      {/* ============================================================ */}
      {/* 1. MOBILE VIEW (< md): Interactive Full-Screen App Experience */}
      {/* ============================================================ */}
      <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden md:hidden">
        {/* Mobile Step 1: Splash Screen */}
        <div
          className={`absolute inset-0 flex flex-col justify-between transition-transform duration-500 ease-in-out ${
            step === "splash" ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-1 flex-col items-center justify-center px-6 pt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <img src={companyLogo} alt="Medergency Logo" className="mb-6 h-28 w-auto object-contain drop-shadow-md" />
            <img src={companyName} alt="Medergency" className="mb-1 h-8 w-auto object-contain" />
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Life Deserves Care
            </p>

            <div className="mt-14 text-center">
              <h1 className="text-2xl font-bold leading-tight text-foreground">
                Consult a Doctor
                <br />
                <span className="text-primary">Connect in Minutes</span>
              </h1>
            </div>

            <div className="mt-8 flex gap-2">
              <div className="h-1.5 w-6 rounded-full bg-primary transition-all duration-300"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-primary/20 transition-all duration-300"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-primary/20 transition-all duration-300"></div>
            </div>
          </div>

          <div className="relative mt-auto w-full">
            <svg viewBox="0 0 1440 320" className="absolute bottom-0 z-0 w-full text-primary/10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,149.3C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
            <svg viewBox="0 0 1440 320" className="absolute bottom-0 z-10 w-full text-primary/20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,128L48,149.3C96,171,192,213,288,213.3C384,213,480,171,576,160C672,149,768,171,864,192C960,213,1056,235,1152,213.3C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
            <div className="relative z-20 px-6 pb-10 pt-20 text-center">
              <Button 
                className="w-full h-14 rounded-2xl text-base font-semibold shadow-xl shadow-primary/25 transition-transform active:scale-95" 
                onClick={() => setStep("role")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Step 2: Role Selection Screen */}
        <div
          className={`absolute inset-0 flex flex-col justify-between transition-transform duration-500 ease-in-out ${
            step === "role" ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <div>
            <div className="flex items-center justify-between px-6 pt-8 pb-2">
              <button 
                onClick={() => setStep("splash")}
                className="rounded-full p-2 hover:bg-accent transition-colors -ml-2"
                aria-label="Go back"
              >
                <ArrowLeft size={22} className="text-foreground" />
              </button>
              <button 
                onClick={() => navigate({ to: "/patient/login" })}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Skip
              </button>
            </div>

            <div className="flex flex-col items-center px-6 mt-1">
              <img src={companyLogo} alt="Logo" className="h-10 w-auto mb-2" />
              <img src={companyName} alt="Medergency" className="h-5 w-auto mb-1" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Life Deserves Care
              </p>
            </div>

            <div className="mt-6 px-6 text-center">
              <h2 className="text-2xl font-bold text-foreground">Who are you?</h2>
              <p className="mt-1.5 text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Choose your role to get the best experience on Medergency.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3.5 px-6">
              {/* Patient Card */}
              <button
                onClick={() => navigate({ to: "/patient/login" })}
                className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#e0ebff] p-4 text-left transition-all active:scale-[0.98] border border-white/60 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <UserRound size={22} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[#1e293b]">I am a Patient</h3>
                  <p className="mt-0.5 text-xs font-medium leading-relaxed text-[#475569]">
                    Book a doctor, get prescriptions, and track health.
                  </p>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                  <ArrowRightIcon size={14} />
                </div>
              </button>

              {/* Doctor Card */}
              <button
                onClick={() => navigate({ to: "/doctor/login" })}
                className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#f8f5ff] to-[#f0ebff] p-4 text-left transition-all active:scale-[0.98] border border-white/60 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Stethoscope size={22} className="text-[#8b5cf6]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[#1e293b]">I am a Doctor</h3>
                  <p className="mt-0.5 text-xs font-medium leading-relaxed text-[#475569]">
                    Manage consultations and grow your practice.
                  </p>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8b5cf6] text-white shadow-sm">
                  <ArrowRightIcon size={14} />
                </div>
              </button>
            </div>
          </div>

          <div className="px-6 pb-6 text-center text-[11px] text-muted-foreground/75">
            By continuing, you agree to our{" "}
            <span className="font-semibold text-primary">Terms</span> and{" "}
            <span className="font-semibold text-primary">Privacy Policy</span>.
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. LAPTOP / DESKTOP VIEW (>= md): Full-Featured Modern Portal */}
      {/* ============================================================ */}
      <div className="hidden min-h-[100dvh] flex-col md:flex">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <img src={companyLogo} alt="Medergency Logo" className="h-10 w-auto object-contain" />
              <div className="flex flex-col">
                <img src={companyName} alt="Medergency" className="h-5 w-auto object-contain" />
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Life Deserves Care
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild className="rounded-xl font-medium">
                <Link to="/patient/login">Patient Login</Link>
              </Button>
              <Button variant="outline" asChild className="rounded-xl font-medium">
                <Link to="/doctor/login">Doctor Portal</Link>
              </Button>
              <Button asChild className="rounded-xl shadow-md shadow-primary/20 font-semibold">
                <Link to="/patient/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1">
          <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
            {/* Background glowing gradients */}
            <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[130px]" />
            <div className="absolute top-1/3 right-10 -z-10 h-[350px] w-[350px] rounded-full bg-purple-500/10 blur-[100px]" />

            <div className="mx-auto grid max-w-7xl items-center gap-12 px-8 lg:grid-cols-12">
              {/* Left Column: Headings & Direct Portal Selection */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
                  <ShieldCheck size={16} />
                  Verified Doctors • 24/7 Access • Secure Consultations
                </div>

                <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Consult a Doctor, <br />
                  <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                    Connect in Minutes.
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed">
                  Fast, accessible medical care at your fingertips. Book video consultations with verified specialists or manage your clinical practice effortlessly.
                </p>

                {/* Desktop Role Cards Side by Side */}
                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                  {/* Patient Card */}
                  <div className="group relative flex flex-col justify-between rounded-3xl border border-border/60 bg-gradient-to-b from-card to-card/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                    <div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                        <UserRound size={28} />
                      </div>
                      <h3 className="mt-5 text-xl font-bold text-foreground">I am a Patient</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        Find top-rated specialists, book appointments, and store medical records securely.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                      <Button asChild className="flex-1 rounded-xl shadow-sm">
                        <Link to="/patient/register">Register</Link>
                      </Button>
                      <Button variant="outline" asChild className="rounded-xl">
                        <Link to="/patient/login">Log In</Link>
                      </Button>
                    </div>
                  </div>

                  {/* Doctor Card */}
                  <div className="group relative flex flex-col justify-between rounded-3xl border border-border/60 bg-gradient-to-b from-[#111827] to-[#0f172a] p-6 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10">
                    <div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300 transition-transform group-hover:scale-110">
                        <Stethoscope size={28} />
                      </div>
                      <h3 className="mt-5 text-xl font-bold text-white">I am a Doctor</h3>
                      <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                        Expand your reach, provide video consultations, and manage digital prescriptions seamlessly.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                      <Button asChild variant="secondary" className="flex-1 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-sm">
                        <Link to="/doctor/onboarding">Join Now</Link>
                      </Button>
                      <Button variant="outline" asChild className="rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-white">
                        <Link to="/doctor/login">Log In</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Showcase */}
              <div className="relative lg:col-span-5">
                <div className="relative mx-auto max-w-md overflow-hidden rounded-[2.5rem] border border-border/60 bg-card p-3 shadow-2xl">
                  <img
                    src={heroDoctor}
                    alt="Verified Doctor Ready for Video Consultation"
                    className="aspect-[4/5] w-full rounded-[2rem] object-cover"
                  />
                  {/* Floating badge 1 */}
                  <div className="absolute -left-6 bottom-12 flex items-center gap-3 rounded-2xl border border-border/60 bg-background/95 p-3.5 shadow-xl backdrop-blur-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Video size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">HD Video Consultations</p>
                      <p className="text-[11px] text-muted-foreground">Join instantly anywhere</p>
                    </div>
                  </div>

                  {/* Floating badge 2 */}
                  <div className="absolute -right-4 top-10 flex items-center gap-2.5 rounded-2xl border border-border/60 bg-background/95 px-4 py-2.5 shadow-xl backdrop-blur-md">
                    <CalendarCheck size={18} className="text-emerald-500" />
                    <span className="text-xs font-bold text-foreground">Instant Booking</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-border/40 py-8 text-center text-xs text-muted-foreground">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 sm:flex-row">
            <div className="flex items-center gap-2">
              <img src={companyLogo} alt="Logo" className="h-5 w-auto" />
              <span className="font-semibold text-foreground">Medergency</span>
              <span>— Life Deserves Care</span>
            </div>
            <p>Prototype & Consultation Platform. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
