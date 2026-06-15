"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Coins, FileText, X, CheckCheck } from "lucide-react";
import axios from "axios";

interface Notif {
  _id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  credits_approved:  <Coins size={13} className="text-green-500" />,
  credits_rejected:  <X size={13} className="text-red-500" />,
  credits_assigned:  <Coins size={13} className="text-blue-500" />,
  credits_deducted:  <Coins size={13} className="text-amber-500" />,
  document_ready:    <FileText size={13} className="text-purple-500" />,
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
  const dropRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const fetchNotifs = useCallback(async () => {
    try {
      const res = await axios.get<{ notifications: Notif[] }>("/api/notifications");
      const list = res.data.notifications ?? [];
      setNotifs(list);
      setUnread(list.filter((n) => !n.read).length);
    } catch { /* non-fatal */ }
  }, []);

  useEffect(() => {
    fetchNotifs();
    const iv = setInterval(fetchNotifs, 30_000);
    return () => clearInterval(iv);
  }, [fetchNotifs]);

  const handleOpen = async () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen && unread > 0) {
      try {
        await axios.patch("/api/notifications");
        setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnread(0);
      } catch { /* non-fatal */ }
    }
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        dropRef.current && !dropRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
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
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={dropRef}
          className="absolute right-0 top-11 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
            <div className="flex items-center gap-2">
              {notifs.length > 0 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">{notifs.length} total</span>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Body */}
          {notifs.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Bell size={28} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-xs text-gray-400 dark:text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
              {notifs.map((n) => (
                <div
                  key={n._id}
                  className={`px-4 py-3 flex gap-3 transition-colors ${
                    !n.read
                      ? "bg-blue-50/60 dark:bg-blue-900/10"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {TYPE_ICON[n.type] ?? <Bell size={12} className="text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white leading-snug">{n.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">{n.body}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {notifs.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <CheckCheck size={12} />
              All notifications · last 20 shown
            </div>
          )}
        </div>
      )}
    </div>
  );
}
