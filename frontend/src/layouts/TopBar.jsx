import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Crown,
  LogOut,
  Search,
  Settings,
  Shield,
  User,
  X,
} from "lucide-react";
import { auth } from "../Components/auth";

const ranges = ["daily", "weekly", "monthly", "yearly"];

const searchablePages = [
  { label: "Dashboard", path: "/dashboard", hint: "Revenue overview" },
  { label: "Profile", path: "/profile", hint: "Account and role details" },
  { label: "Transactions", path: "/transactions", hint: "Orders and payments" },
  { label: "Customers", path: "/customers", hint: "Customer records" },
  { label: "Analytics", path: "/analytics", hint: "Charts and trends" },
  { label: "Milestones", path: "/milestones", hint: "Revenue goals" },
  { label: "Admin Panel", path: "/admin", hint: "System overview", adminOnly: true },
];

export default function Topbar({
  title,
  subtitle,
  range = "monthly",
  onRangeChange,
}) {
  const navigate = useNavigate();
  const user = auth.get();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = (user?.name || user?.email || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return searchablePages
      .filter((page) => !page.adminOnly || user?.role === "admin")
      .filter((page) => {
        if (!normalized) return true;
        return (
          page.label.toLowerCase().includes(normalized) ||
          page.hint.toLowerCase().includes(normalized)
        );
      });
  }, [query, user?.role]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const goTo = (path) => {
    navigate(path);
    setSearchOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
    setQuery("");
  };

  const handleLogout = async () => {
    await auth.logout();
    setProfileOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 left-0 z-50 flex items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-3">
      <div>
        <h1 className="px-3 text-lg font-semibold text-white">{title}</h1>

        {subtitle && <p className="px-3 text-xs text-gray-400">{subtitle}</p>}
      </div>

      <div className="relative flex items-center gap-3">
        {onRangeChange && (
          <div className="hidden items-center gap-1 rounded-lg bg-slate-800 p-1 sm:flex">
            {ranges.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onRangeChange(item)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${
                  range === item
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setSearchOpen(true);
            setNotificationsOpen(false);
            setProfileOpen(false);
          }}
          className="rounded-lg p-2 text-gray-400 hover:bg-slate-800 hover:text-white"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        <button
          type="button"
          onClick={() => {
            setNotificationsOpen((open) => !open);
            setProfileOpen(false);
          }}
          className="relative rounded-lg p-2 text-gray-400 hover:bg-slate-800 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500" />
        </button>

        <button
          type="button"
          onClick={() => {
            setProfileOpen((open) => !open);
            setNotificationsOpen(false);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-black hover:bg-emerald-400"
          aria-label="Profile menu"
        >
          {initials}
        </button>

        {notificationsOpen && (
          <div className="absolute right-10 top-11 z-[90] w-72 rounded-xl border border-slate-700 bg-slate-950 p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Notifications</p>
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                aria-label="Close notifications"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                Your workspace is connected to the API.
              </div>
              <div className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-300">
                Review your latest income activity from the dashboard.
              </div>
            </div>
          </div>
        )}

        {profileOpen && (
          <div className="absolute right-0 top-11 z-[90] w-64 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">
            <div className="border-b border-slate-800 p-4">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || "Signed in"}
              </p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
              <p className="mt-2 w-fit rounded-full bg-slate-800 px-2 py-0.5 text-[11px] capitalize text-slate-300">
                {user?.role || "user"}
              </p>
            </div>

            <div className="p-2">
              <button
                type="button"
                onClick={() => goTo("/profile")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <User size={15} />
                Profile overview
              </button>

              <button
                type="button"
                onClick={() => goTo("/dashboard")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Crown size={15} />
                Dashboard
              </button>

              {user?.role === "admin" && (
                <button
                  type="button"
                  onClick={() => goTo("/admin")}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Shield size={15} />
                  Admin panel
                </button>
              )}

              <button
                type="button"
                onClick={() => goTo("/milestones")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Settings size={15} />
                Goals & settings
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-20 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
              <Search size={18} className="text-cyan-300" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-400">
                  No matches found
                </p>
              ) : (
                results.map((page) => (
                  <button
                    key={page.path}
                    type="button"
                    onClick={() => goTo(page.path)}
                    className="w-full rounded-lg px-3 py-3 text-left hover:bg-slate-800"
                  >
                    <span className="block text-sm font-semibold text-white">
                      {page.label}
                    </span>
                    <span className="block text-xs text-slate-400">
                      {page.hint}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
