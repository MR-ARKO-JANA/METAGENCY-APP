import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMedergency } from "@/lib/medergency/store";
import { Panel } from "./ui";

export function NotificationList({ userId }: { userId: string }) {
  const { notifications, markRead, markAllRead, clearNotifications } = useMedergency();
  const mine = notifications.filter((n) => n.userId === userId);
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <Button
          size="sm"
          variant="outline"
          disabled={!mine.some((n) => !n.read)}
          onClick={() => markAllRead(userId)}
          className="rounded-full bg-white font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <Check size={14} className="mr-1.5" />
          Mark all as read
        </Button>
        <button
          disabled={!mine.length}
          onClick={() => clearNotifications(userId)}
          className="text-xs font-bold text-red-500 hover:text-red-600 disabled:opacity-50"
        >
          Clear all
        </button>
      </div>
      <div className="grid gap-2">
        {mine.length === 0 && (
          <Panel>
            <p className="text-sm text-muted-foreground">You're all caught up.</p>
          </Panel>
        )}
        {mine.map((n, i) => (
          <div
            key={n.id}
            className="flex gap-4 rounded-2xl bg-white p-4 transition-all hover:shadow-md"
            style={{
              boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.05)",
              animation: `fadeInUp 0.45s ease ${i * 80}ms both`,
              transitionDuration: "0.25s",
            }}
          >
            <span
              className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${n.read ? "bg-slate-100 text-slate-400" : "bg-[#2563eb] text-white animate-pulse-glow"}`}
            >
              <Bell size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-slate-800">
                {n.title}
                {!n.read && (
                  <span
                    className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-black text-white animate-bounce-in"
                    style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
                  >
                    NEW
                  </span>
                )}
              </p>
              <p className="text-sm text-slate-500 mt-0.5">{n.body}</p>
              <p className="mt-1 text-[11px] text-slate-400">
                {new Date(n.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            {!n.read && (
              <button
                onClick={() => markRead(n.id)}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors self-start mt-1 animated-underline"
              >
                Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
