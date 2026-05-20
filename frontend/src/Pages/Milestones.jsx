import { useEffect, useState } from 'react';
import { Plus, Trophy, Target } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Topbar from '../layouts/TopBar';
import MilestoneCard from '../features/MilestoneCard';
import AddMilestoneModal from '../features/AddMilestoneModal';
import { formatCurrency } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { milestonesDb } from '../lib/data';
import { getApiError } from '../lib/api';

export default function Milestones() {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');

  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    milestonesDb
      .getAll()
      .then(setMilestones)
      .catch((err) => toast.error(getApiError(err, 'Could not load milestones')));
  }, []);

  const addMilestone = async (milestone) => {
    const newMilestone = await milestonesDb.add(milestone);
    setMilestones((prev) => [...prev, newMilestone]);
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

  const achieved = milestones.filter((m) => m.status === 'achieved');
  const onTrack = milestones.filter((m) => m.status === 'on-track');
  const atRisk = milestones.filter((m) => m.status === 'at-risk');
  const completed = milestones.filter((m) => m.status === 'completed');
  const failed = milestones.filter((m) => m.status === 'failed');

  const filtered =
    filter === 'all'
      ? milestones
      : milestones.filter((m) => m.status === filter);

  const handleDelete = async (id) => {
    try {
      await deleteMilestone(id);
      toast.success('Milestone removed');
    } catch (err) {
      toast.error(getApiError(err, 'Could not remove milestone'));
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateMilestoneStatus(id, status);
      toast.success('Milestone status updated');
    } catch (err) {
      toast.error(getApiError(err, 'Could not update milestone'));
    }
  };

  const totalTarget = milestones.reduce(
    (s, m) => s + m.target,
    0
  );

  const totalCurrent = milestones.reduce(
    (s, m) => s + m.current,
    0
  );

  const tabCls = (active) =>
    `px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
      active
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
    }`;

  return (
    <AppLayout>
      <Topbar
        title="Milestones"
        subtitle="Track revenue goals and targets"
      />

      <main className="flex-1 p-4 lg:p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                <Trophy size={15} className="text-cyan-400" />
              </div>

              <p className="text-xs text-gray-300">
                Achieved
              </p>
            </div>

            <p className="text-2xl font-bold font-mono text-cyan-400">
              {achieved.length}
            </p>

            <p className="text-xs text-muted-foreground mt-0.5">
              of {milestones.length} milestones
            </p>
          </div>

          <div className="bg-gray-900 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                <Target size={15} className="text-emerald-400" />
              </div>

              <p className="text-xs text-gray-300">
                Total Target
              </p>
            </div>

            <p className="text-2xl font-bold font-mono">
              {formatCurrency(totalTarget)}
            </p>
          </div>

          <div className="bg-gray-900 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <span className="text-amber-400 text-sm font-bold">
                  %
                </span>
              </div>

              <p className="text-xs text-gray-300">
                Overall Progress
              </p>
            </div>

            <p className="text-2xl font-bold font-mono">
              {totalTarget > 0
                ? ((totalCurrent / totalTarget) * 100).toFixed(1)
                : 0}
              %
            </p>

            <p className="text-xs text-muted-foreground mt-0.5">
              {formatCurrency(totalCurrent)} of{' '}
              {formatCurrency(totalTarget)}
            </p>
          </div>
        </div>

        {/* Filter & Add */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5 bg-muted rounded-lg p-1">
            <button
              className={tabCls(filter === 'all')}
              onClick={() => setFilter('all')}
            >
              All ({milestones.length})
            </button>

            <button
              className={tabCls(filter === 'on-track')}
              onClick={() => setFilter('on-track')}
            >
              On Track ({onTrack.length})
            </button>

            <button
              className={tabCls(filter === 'at-risk')}
              onClick={() => setFilter('at-risk')}
            >
              At Risk ({atRisk.length})
            </button>

            <button
              className={tabCls(filter === 'achieved')}
              onClick={() => setFilter('achieved')}
            >
              Achieved ({achieved.length})
            </button>

            <button
              className={tabCls(filter === 'completed')}
              onClick={() => setFilter('completed')}
            >
              Completed ({completed.length})
            </button>

            <button
              className={tabCls(filter === 'failed')}
              onClick={() => setFilter('failed')}
            >
              Failed ({failed.length})
            </button>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-linear-to-br from-cyan-400 to-emerald-500 text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            New Milestone
          </button>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Trophy
              size={32}
              className="text-muted-foreground mx-auto mb-3"
            />

            <p className="text-muted-foreground text-sm mb-3">
              No milestones yet
            </p>

            <button
              onClick={() => setShowAdd(true)}
              className="text-sm text-primary hover:underline"
            >
              Create your first milestone
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((m) => (
              <MilestoneCard
                key={m._id || m.id}
                milestone={m}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
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
            toast.success('Milestone created!');
          } catch (err) {
            toast.error(getApiError(err, 'Could not create milestone'));
          }
        }}
      />
    </AppLayout>
  );
}
