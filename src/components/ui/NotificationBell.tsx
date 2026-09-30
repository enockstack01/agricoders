"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Coins, FileText, X, ClipboardList } from "@/components/plan/icons";
import axios from "axios";

interface Notif {
  _id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

// CropManager notif-icon tones
const TYPE_ICON: Record<string, { tone: string; icon: React.ReactNode }> = {
  credits_approved:       { tone: "success", icon: <Coins size={15} /> },
  credits_rejected:       { tone: "danger",  icon: <X size={15} /> },
  credits_assigned:       { tone: "info",    icon: <Coins size={15} /> },
  credits_deducted:       { tone: "warning", icon: <Coins size={15} /> },
  document_ready:         { tone: "purple",  icon: <FileText size={15} /> },
  credit_request_pending: { tone: "warning", icon: <ClipboardList size={15} /> },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = useCallback(async () => {
    try {
      const res = await axios.get<{ notifications: Notif[] }>("/api/notifications");
      const list = res.data.notifications ?? [];
      setNotifs(list);
      setUnread(list.filter((n) => !n.read).length);
    } catch { /* non-fatal */ }
  }, []);

  useEffect(() => {
    const kickoff = setTimeout(fetchNotifs, 0);
    const iv = setInterval(fetchNotifs, 30_000);
    return () => {
      clearTimeout(kickoff);
      clearInterval(iv);
    };
  }, [fetchNotifs]);

  const toggleOne = async (id: string, currentRead: boolean) => {
    const nextRead = !currentRead;
    setNotifs((prev) => prev.map((n) => n._id === id ? { ...n, read: nextRead } : n));
    setUnread((prev) => nextRead ? Math.max(0, prev - 1) : prev + 1);
    try {
      await axios.patch("/api/notifications", { id, read: nextRead });
    } catch {
      // revert on failure
      setNotifs((prev) => prev.map((n) => n._id === id ? { ...n, read: currentRead } : n));
      setUnread((prev) => nextRead ? prev + 1 : Math.max(0, prev - 1));
    }
  };

  const markAllRead = async () => {
    if (!notifs.some((n) => !n.read)) return;
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
    try {
      await axios.patch("/api/notifications");
    } catch { /* non-fatal */ }
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="dropdown" ref={wrapRef}>
      <button className="topbar-btn" onClick={() => setOpen((v) => !v)} aria-label="Notifications" title="Notifications">
        <Bell size={18} />
        {unread > 0 && <span className="badge-count">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div className="dropdown-menu notif-dropdown">
          <div className="dropdown-menu-header">
            <span>Notifications</span>
            {notifs.some((n) => !n.read) && <button onClick={markAllRead}>Mark all read</button>}
          </div>

          {notifs.length === 0 ? (
            <div className="dropdown-empty">No new notifications</div>
          ) : (
            <div className="notif-list">
              {notifs.map((n) => {
                const t = TYPE_ICON[n.type] ?? { tone: "info", icon: <Bell size={15} /> };
                return (
                  <div
                    key={n._id}
                    className={`notif-item${n.read ? "" : " unread"}`}
                    onClick={() => toggleOne(n._id, n.read)}
                    title={n.read ? "Mark as unread" : "Mark as read"}
                  >
                    <div className={`notif-icon ${t.tone}`}>{t.icon}</div>
                    <div className="notif-content">
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-text">{n.body}</div>
                      <div className="notif-time">{timeAgo(n.createdAt)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {notifs.length > 0 && <div className="notif-footer">Last 20 shown · click a notification to toggle read</div>}
        </div>
      )}
    </div>
  );
}
