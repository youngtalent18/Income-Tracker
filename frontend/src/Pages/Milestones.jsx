import { useState } from "react";
import { Plus, Trophy, Target } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import Topbar from "../layouts/TopBar";
import MilestoneCard from "../features/MilestoneCard";
import AddMilestoneModal from "../features/AddMilestoneModal";
import { formatCurrency } from "../lib/utils";
import { toast } from "react-hot-toast";
import { milestonesDb } from "../lib/data";
import { getApiError } from "../lib/api";

export default function Milestones() {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [milestones, setMilestones] = useState([]);

  // ---------------- LOAD ----------------
  useState(() => {
    milestonesDb
      .getAll()
      .then(setMilestones)
      .catch((err) =>
        toast.error(getApiError(err, "Could not load milestones"))
      );
  }, []);

  // ---------------- CRUD ----------------
  const addMilestone = async (m) => {
    const newM = await milestonesDb.add(m);
    setMilestones((prev) => [...prev, newM]);
  };

  const deleteMilestone = async (id) => {
    await milestonesDb.remove(id);
    setMilestones((prev) => prev.filter((m) => (m._id || m.id) !== id));
  };

  const updateMilestoneStatus = async (id, status) => {
    const updated = await milestonesDb.update(id, { status });
    setMilestones((prev) =>
      prev.map((m) => ((m._id || m.id) === id ? updated : m))
    );
  };

  // ---------------- FILTERS ----------------
  const grouped = {
    all: milestones,
    "on-track": milestones.filter((m) => m.status === "on-track"),
    "at-risk": milestones.filter((m) => m.status === "at-risk"),
    achieved: milestones.filter((m) => m.status === "achieved"),
    completed: milestones.filter((m) => m.status === "completed"),
    failed: milestones.filter((m) => m.status === "failed"),
  };

  const filtered = grouped[filter] || [];

  // ---------------- STATS ----------------
  const totalTarget = milestones.reduce((s, m) => s + (m.target || 0), 0);
  const totalCurrent = milestones.reduce((s, m) => s + (m.current || 0), 0);

  const tabCls = (active) =>
    `px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
      active
        ? "bg-cyan-500 text-black"
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    }`;

  return (
    <AppLayout>
      <Topbar title="Milestones" subtitle="Track revenue goals and targets" />

      <main className="flex-1 p-4 lg:p-6 space-y-6">

        {/* ---------------- SUMMARY ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Achieved */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="text-cyan-400" size={18} />
                <p className="text-xs text-slate-400">Achieved</p>
              </div>
            </div>

            <p className="text-3xl font-bold text-cyan-400">
              {grouped.achieved.length}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              of {milestones.length} milestones
            </p>
          </div>

          {/* Target */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-emerald-400" size={18} />
              <p className="text-xs text-slate-400">Total Target</p>
            </div>

            <p className="text-2xl font-bold">
              {formatCurrency(totalTarget)}
            </p>
          </div>

          {/* Progress */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-400 font-bold">%</span>
              <p className="text-xs text-slate-400">Overall Progress</p>
            </div>

            <p className="text-2xl font-bold">
              {totalTarget
                ? ((totalCurrent / totalTarget) * 100).toFixed(1)
                : 0}
              %
            </p>

            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(totalCurrent)} / {formatCurrency(totalTarget)}
            </p>
          </div>
        </div>

        {/* ---------------- FILTER BAR ---------------- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          {/* scrollable filter (mobile fix) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar bg-slate-900 border border-slate-800 p-2 rounded-xl">
            {Object.keys(grouped).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={tabCls(filter === key)}
              >
                {key} ({grouped[key].length})
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-cyan-400 to-emerald-500 text-black font-semibold hover:opacity-90 transition w-full sm:w-auto"
          >
            <Plus size={14} />
            New Milestone
          </button>
        </div>

        {/* ---------------- GRID ---------------- */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <Trophy size={34} className="mx-auto text-slate-500 mb-3" />
            <p className="text-slate-400 text-sm">
              No milestones found
            </p>

            <button
              onClick={() => setShowAdd(true)}
              className="text-cyan-400 text-sm mt-2 hover:underline"
            >
              Create your first milestone
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((m) => (
              <MilestoneCard
                key={m._id || m.id}
                milestone={m}
                onDelete={deleteMilestone}
                onStatusChange={updateMilestoneStatus}
              />
            ))}
          </div>
        )}
      </main>

      <AddMilestoneModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={async (m) => {
          try {
            await addMilestone(m);
            toast.success("Milestone created");
          } catch (err) {
            toast.error(getApiError(err));
          }
        }}
      />
    </AppLayout>
  );
}