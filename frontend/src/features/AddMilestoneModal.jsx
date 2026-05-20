import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddMilestoneModal({
  open,
  onClose,
  onAdd,
}) {
  const [form, setForm] = useState({
    title: '',
    target: '',
    current: '0',
    period: 'monthly',
    deadline: '',
    status: 'on-track',
  });

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onAdd({
      title: form.title,
      target: parseFloat(form.target),
      current: parseFloat(form.current),
      period: form.period,
      deadline: new Date(form.deadline).toISOString(),
      status: form.status,
    });

    setForm({
      title: '',
      target: '',
      current: '0',
      period: 'monthly',
      deadline: '',
      status: 'on-track',
    });

    onClose();
  };

  const inputCls =
    'w-full bg-input border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-gray-300 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow';

  const labelCls =
    'block text-xs font-medium text-gray-300 mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-card border border-slate-700 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <h2 className="font-semibold text-foreground">
            New Milestone
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-gray-300  hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={labelCls}>Title *</label>

            <input
              required
              className={inputCls}
              placeholder="Monthly Revenue Target"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  title: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>
                Target Amount *
              </label>

              <input
                required
                type="number"
                min="1"
                className={inputCls}
                placeholder="25000"
                value={form.target}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    target: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className={labelCls}>
                Current Amount
              </label>

              <input
                type="number"
                min="0"
                className={inputCls}
                placeholder="0"
                value={form.current}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    current: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className={labelCls}>Period</label>

              <select
                className={inputCls}
                value={form.period}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    period: e.target.value,
                  }))
                }
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Status</label>

              <select
                className={inputCls}
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value,
                  }))
                }
              >
                <option value="on-track">On Track</option>
                <option value="at-risk">At Risk</option>
                <option value="achieved">Achieved</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Deadline *</label>

            <input
              required
              type="date"
              className={inputCls}
              value={form.deadline}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  deadline: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Create Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
