import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { DoctorCard, PageTitle } from "@/components/medergency/ui";
import { DoctorFilters, applyFilters, emptyFilters } from "@/components/medergency/DoctorFilters";
import { doctors } from "@/lib/medergency/mock-data";
import { useMedergency } from "@/lib/medergency/store";
import { nextOpenSlots } from "@/lib/medergency/availability";

export const Route = createFileRoute("/patient/doctors/")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Find a Doctor | Medergency" },
      {
        name: "description",
        content: "Search verified doctors by name, specialty, fee, experience and language.",
      },
      { property: "og:title", content: "Find a Doctor | Medergency" },
      {
        property: "og:description",
        content: "Search and book verified doctors for video consultations.",
      },
    ],
  }),
  component: FindDoctor,
});

function FindDoctor() {
  const { q } = Route.useSearch();
  const { availability, appointments } = useMedergency();
  const [filters, setFilters] = useState({ ...emptyFilters, q: q ?? "" });
  const list = useMemo(
    () => applyFilters(doctors, filters, availability, appointments),
    [filters, availability, appointments],
  );
  return (
    <div>
      <PageTitle
        title="Select Doctor"
        subtitle=""
      />
      <div className="relative mb-3">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          placeholder="Search doctor by name or specialty"
          className="h-11 bg-card pl-9 rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-blue-500/20 transition-all"
          aria-label="Search doctors"
        />
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {["General Physician", "Gynecologist", "Psychiatrist"].map((spec) => (
          <button
            key={spec}
            onClick={() => setFilters({ ...filters, specialty: spec })}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              filters.specialty === spec
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      <div className="hidden">
        <DoctorFilters value={filters} onChange={setFilters} withSort />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        {list.length} doctor{list.length === 1 ? "" : "s"} found · ratings shown are sample data
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((d) => (
          <DoctorCard
            key={d.id}
            doctor={d}
            nextSlots={nextOpenSlots(d.id, availability[d.id], appointments)}
          />
        ))}
      </div>
    </div>
  );
}
