import { Mail, Shield, User } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import Topbar from "../layouts/TopBar";
import { auth } from "../Components/auth";

export default function Profile() {
  const user = auth.get();

  return (
    <AppLayout>
      <Topbar title="Profile" subtitle="Account details and access level" />

      <main className="flex-1 p-4 lg:p-6">
        <section className="max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-lg font-black text-slate-950">
              {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                {user?.name || "User"}
              </h2>
              <p className="text-sm text-slate-400">
                Manage your visible account information.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3">
              <User size={17} className="text-cyan-300" />
              <div>
                <p className="text-xs text-slate-500">Name</p>
                <p className="text-sm font-medium text-white">
                  {user?.name || "Not set"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3">
              <Mail size={17} className="text-emerald-300" />
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm font-medium text-white">
                  {user?.email || "Not set"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3">
              <Shield size={17} className="text-amber-300" />
              <div>
                <p className="text-xs text-slate-500">Access</p>
                <p className="text-sm font-medium capitalize text-white">
                  {user?.role || "user"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
