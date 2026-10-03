import React, { useEffect, useState, useCallback } from 'react';
import {
  RefreshCw,
  Edit2,
  Check,
  X,
  Database,
  ToggleLeft,
  ToggleRight,
  Users,
  Briefcase,
  Building2,
  Trophy,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { statsApi, LandingStatItem, UpdateStatPayload } from '../../../api/endpoints/stats.api';
import { toast } from 'react-hot-toast';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  users: Users,
  briefcase: Briefcase,
  building2: Building2,
  trophy: Trophy,
};

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors';

interface EditState {
  manualValue: string;
  label: string;
  suffix: string;
}

export const AdminLandingStats: React.FC = () => {
  const [stats, setStats] = useState<LandingStatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({ manualValue: '', label: '', suffix: '' });
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const syncCache = (items: LandingStatItem[]) => {
    try {
      localStorage.setItem('interhive_landing_stat_items', JSON.stringify(items));
      window.dispatchEvent(new Event('landing-stats-updated'));
    } catch (e) {}
  };

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await statsApi.getAdminStatConfigs();
      if (res.data?.data) {
        setStats(res.data.data);
        syncCache(res.data.data);
      }
    } catch (err: any) {
      toast.error('Failed to load stat configurations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleStartEdit = (stat: LandingStatItem) => {
    setEditingKey(stat.key);
    setEditState({
      manualValue: String(stat.manualValue ?? stat.value),
      label: stat.label,
      suffix: stat.suffix,
    });
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
  };

  const handleSaveEdit = async (key: string) => {
    const numVal = parseInt(editState.manualValue, 10);
    if (isNaN(numVal) || numVal < 0) {
      toast.error('Please enter a valid non-negative number.');
      return;
    }

    setSavingKey(key);
    try {
      const payload: UpdateStatPayload = {
        manualValue: numVal,
        useManualValue: true, // saving manual value always enables manual mode
        label: editState.label.trim() || undefined,
        suffix: editState.suffix,
      };
      const res = await statsApi.updateStat(key, payload);
      setStats(prev => {
        const next = prev.map(s => s.key === key ? { ...s, ...res.data.data, value: numVal } : s);
        syncCache(next);
        return next;
      });
      setEditingKey(null);
      toast.success('Stat updated successfully.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update stat.');
    } finally {
      setSavingKey(null);
    }
  };

  const handleToggleMode = async (stat: LandingStatItem) => {
    setSavingKey(stat.key);
    try {
      const payload: UpdateStatPayload = { useManualValue: !stat.useManualValue };
      const res = await statsApi.updateStat(stat.key, payload);
      setStats(prev => {
        const next = prev.map(s => s.key === stat.key ? { ...s, useManualValue: !stat.useManualValue } : s);
        syncCache(next);
        return next;
      });
      toast.success(
        !stat.useManualValue
          ? 'Switched to manual value.'
          : 'Switched to live system data.',
      );
    } catch (err: any) {
      toast.error('Failed to toggle mode.');
    } finally {
      setSavingKey(null);
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      const res = await statsApi.syncFromSystemData();
      if (res.data?.data) {
        setStats(res.data.data);
        syncCache(res.data.data);
      }
      toast.success('All stats synced from system data.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Sync failed.');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">Loading stats…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Landing Page Stats</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Control the numbers shown on the public homepage. Each stat can be set manually or synced from live system data.
          </p>
        </div>
        <button
          onClick={handleSyncAll}
          disabled={syncing}
          title="Sync all stats from live DB counts"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          {syncing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>{syncing ? 'Syncing…' : 'Sync from System'}</span>
        </button>
      </div>

      {/* Info callout */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 text-xs text-amber-800 dark:text-amber-300">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>
          <strong>Manual mode</strong> shows exactly the number you enter.{' '}
          <strong>Live mode</strong> shows real counts from the database (applications, companies, etc).
          "Sync from System" pulls current DB counts and switches all stats to live mode.
        </span>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => {
          const IconComp = ICON_MAP[stat.icon] ?? Users;
          const isEditing = editingKey === stat.key;
          const isSaving = savingKey === stat.key;

          return (
            <div
              key={stat.key}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm"
            >
              {/* Top: icon + label + mode toggle */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <IconComp className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        className={inputCls + ' text-xs py-1 max-w-[160px]'}
                        value={editState.label}
                        onChange={e => setEditState(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Stat label"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{stat.label}</p>
                    )}
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{stat.key}</p>
                  </div>
                </div>

                {/* Mode toggle */}
                <button
                  onClick={() => !isSaving && handleToggleMode(stat)}
                  disabled={isSaving || isEditing}
                  title={stat.useManualValue ? 'Switch to Live system data' : 'Switch to Manual value'}
                  className="flex items-center gap-1 text-[11px] font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {stat.useManualValue ? (
                    <>
                      <ToggleLeft className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-500 dark:text-slate-400">Manual</span>
                    </>
                  ) : (
                    <>
                      <ToggleRight className="w-5 h-5 text-primary" />
                      <span className="text-primary">Live</span>
                    </>
                  )}
                </button>
              </div>

              {/* Middle: value display or edit */}
              {isEditing ? (
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="number"
                    min={0}
                    className={inputCls + ' w-32'}
                    value={editState.manualValue}
                    onChange={e => setEditState(prev => ({ ...prev, manualValue: e.target.value }))}
                    placeholder="e.g. 5000"
                  />
                  <input
                    type="text"
                    maxLength={4}
                    className={inputCls + ' w-16'}
                    value={editState.suffix}
                    onChange={e => setEditState(prev => ({ ...prev, suffix: e.target.value }))}
                    placeholder="+, %+"
                  />
                  <span className="text-xs text-slate-500">suffix</span>
                </div>
              ) : (
                <div className="mb-3 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                    {stat.value.toLocaleString('en-IN')}
                  </span>
                  <span className="text-lg font-bold text-slate-500 dark:text-slate-400">{stat.suffix}</span>
                  {!stat.useManualValue && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-700/40">
                      <Database className="w-2.5 h-2.5" />
                      Live
                    </span>
                  )}
                </div>
              )}

              {/* Footer: last edit info + action buttons */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-2.5 mt-1">
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  {stat.lastManualEditAt
                    ? `Edited ${new Date(stat.lastManualEditAt).toLocaleDateString('en-IN')}${stat.lastEditedBy ? ` by ${stat.lastEditedBy}` : ''}`
                    : 'Not yet edited'}
                </p>

                <div className="flex items-center gap-1">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleSaveEdit(stat.key)}
                        disabled={isSaving}
                        className="p-1.5 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-60"
                        title="Save"
                      >
                        {isSaving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(stat)}
                      disabled={isSaving}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Edit manually"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
