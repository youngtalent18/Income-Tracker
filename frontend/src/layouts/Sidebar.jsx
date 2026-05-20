import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  BarChart3,
  Target,
  Shield,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { auth } from "../Components/auth";


const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { label: "Customers", path: "/customers", icon: Users },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Milestones", path: "/milestones", icon: Target },
];

const NavContent = ({
  user,
  location,
  setMobileOpen,
  onLogout,
}) => (
  <div className="flex flex-col h-full">

    {/* LOGO */}
    <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
      <img
        src="/image.png"
        alt="SalesFlow"
        className="h-8 w-8 rounded-lg object-cover"
      />

      <div>
        <span className="font-bold text-base text-white">
          SalesFlow
        </span>
        <p className="text-[10px] text-slate-400">
          Analytics Dashboard
        </p>
      </div>
    </div>

    {/* NAV */}
    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
      {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
        const active = location.pathname === path;

        return (
          <Link
            key={path}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              active
                ? "bg-slate-700/40 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Icon size={16} />
            <span>{label}</span>

            {active && (
              <ChevronRight size={14} className="ml-auto text-white" />
            )}
          </Link>
        );
      })}

      {/* ADMIN */}
      {user?.role === "admin" && (
        <>
          <div className="pt-3 pb-1 px-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
              Admin
            </p>
          </div>

          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              location.pathname === "/admin"
                ? "bg-slate-700/40 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Shield size={16} />
            <span>Admin Panel</span>
          </Link>
        </>
      )}
    </nav>

    {/* USER + LOGOUT */}
    <div className="px-2 py-4 border-t border-slate-800">
      <div className="flex items-center gap-3 px-3 py-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-400 to-emerald-500 flex items-center justify-center">
          <span className="text-xs font-bold text-black">
            S
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-sm text-white truncate">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-slate-400 capitalize">
            {user?.role || "user"}
          </p>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </div>
  </div>
);

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await auth.logout();
    setMobileOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* MOBILE TOGGLE */}
      <button
        className="fixed z-60 top-4 left-2 lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent
          user={auth.get()}
          location={location}
          setMobileOpen={setMobileOpen}
          onLogout={handleLogout}
        />
      </aside>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 border-r border-slate-800">
        <NavContent
          user={auth.get()}
          location={location}
          setMobileOpen={setMobileOpen}
          onLogout={handleLogout}
        />
      </aside>
    </>
  );
}
