import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRightIcon, Stethoscope, UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import companyLogo from "@/assets/signal-2026-09-15-23-14-14-623.png";
import companyName from "@/assets/signal-2026-09-15-23-14-14-623_002.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medergency — Online Consultations with Verified Doctors" },
      {
        name: "description",
        content: "Book video consultations with verified doctors, or join Medergency as a doctor.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [step, setStep] = useState<"splash" | "role">("splash");
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-background md:bg-muted flex items-center justify-center">
      {/* Mobile Frame Container for Desktop (Option B constraint: full screen responsive, but feels like an app) */}
      <div className="relative flex h-full min-h-[100dvh] w-full flex-col bg-background shadow-2xl transition-all duration-500 ease-in-out md:h-[90vh] md:min-h-0 md:w-[420px] md:rounded-[2.5rem] md:border-[8px] md:border-muted-foreground/20 md:overflow-hidden">
        
        {/* Step 1: Splash Screen */}
        <div
          className={`absolute inset-0 flex flex-col justify-between transition-transform duration-500 ease-in-out ${
            step === "splash" ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          {/* Top content */}
          <div className="flex flex-1 flex-col items-center justify-center px-6 pt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <img src={companyLogo} alt="Medergency Logo" className="mb-6 h-28 w-auto object-contain drop-shadow-md" />
            <img src={companyName} alt="Medergency" className="mb-1 h-8 w-auto object-contain" />
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Life Deserves Care
            </p>

            <div className="mt-16 text-center">
              <h1 className="text-2xl font-bold leading-tight text-foreground">
                Consult a Doctor
                <br />
                <span className="text-primary">Connect in Minutes</span>
              </h1>
            </div>

            {/* Pagination dots (decorative) */}
            <div className="mt-10 flex gap-2">
              <div className="h-1.5 w-6 rounded-full bg-primary transition-all duration-300"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-primary/20 transition-all duration-300"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-primary/20 transition-all duration-300"></div>
            </div>
          </div>

          {/* Bottom waves & button */}
          <div className="relative mt-auto w-full">
            <svg viewBox="0 0 1440 320" className="absolute bottom-0 z-0 w-full text-primary/10 drop-shadow-lg" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,149.3C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
            <svg viewBox="0 0 1440 320" className="absolute bottom-0 z-10 w-full text-primary/20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,128L48,149.3C96,171,192,213,288,213.3C384,213,480,171,576,160C672,149,768,171,864,192C960,213,1056,235,1152,213.3C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
            <div className="relative z-20 px-6 pb-12 pt-24 text-center">
              <Button 
                className="w-full h-14 rounded-2xl text-lg font-semibold shadow-xl shadow-primary/25 transition-transform active:scale-95" 
                onClick={() => setStep("role")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>

        {/* Step 2: Role Selection Screen */}
        <div
          className={`absolute inset-0 flex flex-col transition-transform duration-500 ease-in-out ${
            step === "role" ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-10 pb-4">
            <button 
              onClick={() => setStep("splash")}
              className="rounded-full p-2 hover:bg-accent transition-colors -ml-2"
              aria-label="Go back"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Skip
            </button>
          </div>

          <div className="flex flex-col items-center px-6 mt-2">
             <img src={companyLogo} alt="Logo" className="h-12 w-auto mb-3" />
             <img src={companyName} alt="Medergency" className="h-5 w-auto mb-1" />
             <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
               Life Deserves Care
             </p>
          </div>

          <div className="mt-8 px-6 text-center animate-in fade-in slide-in-from-right-8 duration-500 delay-150">
            <h2 className="text-2xl font-bold text-foreground">Who are you?</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Choose your role to get the best experience on Medergency.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 px-6 animate-in fade-in slide-in-from-right-8 duration-500 delay-300">
            
            {/* Patient Card */}
            <button
              onClick={() => navigate({ to: "/patient/login" })}
              className="group relative flex w-full items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#eef4ff] to-[#e0ebff] p-5 text-left transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98] border border-white/60"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <UserRound size={26} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#1e293b]">I am a Patient</h3>
                <p className="mt-1 text-xs font-medium leading-relaxed text-[#475569]">
                  Book a doctor, get prescriptions, track your health and more.
                </p>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform group-hover:translate-x-1">
                <ArrowRightIcon size={16} />
              </div>
            </button>

            {/* Doctor Card */}
            <button
              onClick={() => navigate({ to: "/doctor/login" })}
              className="group relative flex w-full items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#f8f5ff] to-[#f0ebff] p-5 text-left transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10 active:scale-[0.98] border border-white/60"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Stethoscope size={26} className="text-[#8b5cf6]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#1e293b]">I am a Doctor</h3>
                <p className="mt-1 text-xs font-medium leading-relaxed text-[#475569]">
                  Manage consultations, help patients, and grow your practice.
                </p>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8b5cf6] text-white shadow-md transition-transform group-hover:translate-x-1">
                <ArrowRightIcon size={16} />
              </div>
            </button>
            
          </div>

          <div className="mt-auto pb-8 text-center text-xs text-muted-foreground/60 animate-in fade-in duration-1000 delay-500">
            By signing up, you agree to our<br/>
            <span className="font-medium text-primary">Terms & Conditions</span> and <span className="font-medium text-primary">Privacy Policy</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
