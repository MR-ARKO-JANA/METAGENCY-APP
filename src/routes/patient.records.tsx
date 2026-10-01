import { createFileRoute } from "@tanstack/react-router";
import { FileText, Lock, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/components/medergency/ui";
import { useMedergency } from "@/lib/medergency/store";
import type { MedicalRecord, RecordCategory } from "@/lib/medergency/types";

export const Route = createFileRoute("/patient/records")({
  head: () => ({
    meta: [
      { title: "Medical Records | Medergency" },
      {
        name: "description",
        content:
          "Upload and organise your prescriptions, lab reports and medical history privately.",
      },
      { property: "og:title", content: "Medical Records | Medergency" },
      { property: "og:description", content: "Your private medical documents in one place." },
    ],
  }),
  component: Records,
});

const categories: RecordCategory[] = [
  "Prescriptions",
  "Lab Reports",
  "Medical History",
  "Other Documents",
];

function Records() {
  const { records, currentPatient, addRecord, deleteRecord } = useMedergency();
  const ref = useRef<HTMLInputElement>(null);
  const [cat, setCat] = useState<RecordCategory | "All">("All");
  const [uploadCat, setUploadCat] = useState<RecordCategory>("Lab Reports");
  const [del, setDel] = useState<MedicalRecord | null>(null);
  const [view, setView] = useState<MedicalRecord | null>(null);
  const mine = records.filter(
    (r) => r.patientId === currentPatient?.id && (cat === "All" || r.category === cat),
  );

  return (
    <div className="grid gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 animate-fade-in-down">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Medical Records</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <Lock size={13} />
            Private — only visible to you and doctors you consult
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label="Upload category"
            value={uploadCat}
            onChange={(e) => setUploadCat(e.target.value as RecordCategory)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            ref={ref}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              if (f.size > 10 * 1024 * 1024) {
                toast.error("File must be under 10 MB");
                return;
              }
              addRecord({
                patientId: currentPatient!.id,
                name: f.name.slice(0, 120),
                category: uploadCat,
                fileType: (f.name.split(".").pop() ?? "file").toUpperCase(),
              });
              toast.success("Record added");
            }}
          />
          <button
            onClick={() => ref.current?.click()}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-md btn-ripple"
            style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
          >
            <Upload size={15} /> Upload report
          </button>
        </div>
      </div>
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 animate-fade-in-up delay-75">
        {(["All", ...categories] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className="rounded-full px-4 py-1.5 text-xs font-bold transition-all capitalize"
            style={{
              background: cat === c ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "white",
              color: cat === c ? "white" : "#64748b",
              boxShadow: cat === c ? "0 4px 12px rgba(37,99,235,0.25)" : "0 1px 4px rgba(0,0,0,0.06)",
              border: cat === c ? "none" : "1px solid rgba(0,0,0,0.06)",
              transform: cat === c ? "scale(1.05)" : "scale(1)",
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-3">
        {mine.length === 0 && (
          <div
            className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center animate-scale-in"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" }}
          >
            <div
              className="mb-4 grid h-14 w-14 place-items-center rounded-2xl text-white"
              style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
            >
              <FileText size={24} />
            </div>
            <p className="font-bold text-slate-700">No documents in this category</p>
            <p className="mt-1 text-sm text-slate-400">Upload your first medical report above</p>
          </div>
        )}
        {mine.map((r, i) => (
          <div
            key={r.id}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 transition-all hover:shadow-md"
            style={{
              boxShadow: "0 2px 16px rgba(37,99,235,0.05)",
              border: "1px solid rgba(59,130,246,0.08)",
              animation: `fadeInUp 0.4s ease ${i * 60}ms both`,
            }}
          >
            <div
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white"
              style={{
                background: r.fileType === "PDF" ? "linear-gradient(135deg,#ef4444,#dc2626)"
                  : r.fileType === "PNG" || r.fileType === "JPG" || r.fileType === "JPEG" ? "linear-gradient(135deg,#8b5cf6,#7c3aed)"
                  : "linear-gradient(135deg,#2563eb,#1d4ed8)",
              }}
            >
              <FileText size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-slate-800">{r.name}</p>
              <p className="text-xs text-slate-400">
                {r.category} · {r.fileType} · {formatDate(r.uploadedAt)}
              </p>
            </div>
            <button
              className="rounded-lg px-3 py-1.5 text-xs font-bold text-blue-600 transition-all hover:bg-blue-50"
              onClick={() => setView(r)}
            >
              View
            </button>
            <button
              aria-label={`Delete ${r.name}`}
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
              onClick={() => setDel(r)}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{view?.name}</DialogTitle>
            <DialogDescription>
              {view?.category} · uploaded {view && formatDate(view.uploadedAt)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid h-48 place-items-center rounded-lg bg-muted text-sm text-muted-foreground">
            Document preview will be available once secure storage is connected.
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              "{del?.name}" will be removed permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (del) deleteRecord(del.id);
                setDel(null);
                toast.success("Document deleted");
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
