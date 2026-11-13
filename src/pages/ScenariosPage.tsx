import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ChevronLeft, Users } from 'lucide-react';
import { fetchScenarios, fetchRoles, deleteScenario, buildScenarioWithRoles } from '@/lib/api';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import type { Scenario, Role, ScenarioWithRoles } from '@/types';

export function ScenariosPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Scenario | null>(null);

  const load = () => {
    Promise.all([fetchScenarios(), fetchRoles()])
      .then(([s, r]) => {
        setScenarios(s);
        setRoles(r);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteScenario(deleteTarget.id);
      setScenarios((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    } catch (err) {
      console.error(err);
    }
    setDeleteTarget(null);
  };

  const buildDetailed = (scenario: Scenario): ScenarioWithRoles => {
    return buildScenarioWithRoles(scenario, roles);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">سناریوها</h1>
        <Link to="/scenarios/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          سناریو جدید
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">در حال بارگذاری...</div>
      ) : scenarios.length === 0 ? (
        <div className="text-center text-gray-500 py-12">هنوز سناریویی تعریف نشده</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {scenarios.map((scenario) => {
            const detailed = buildDetailed(scenario);
            const mafiaCount = detailed.roles
              .filter((r) => r.role.side === 'mafia')
              .reduce((sum, r) => sum + r.count, 0);
            return (
              <div key={scenario.id} className="card group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{scenario.name}</h3>
                      {scenario.is_default && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-navy-700 text-gray-400">پیش‌فرض</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{scenario.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Link
                      to={`/scenarios/${scenario.id}`}
                      className="p-2 rounded-lg text-gray-500 hover:text-gold-500 hover:bg-navy-700 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    {!scenario.is_default && (
                      <button
                        onClick={() => setDeleteTarget(scenario)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-navy-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-ice-400">
                    <Users className="w-4 h-4" />
                    {detailed.totalPlayers} بازیکن
                  </span>
                  <span className="text-gold-500">{mafiaCount} مافیا</span>
                  <span className="text-ice-400">{detailed.totalPlayers - mafiaCount} شهروند</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {detailed.roles.map((r, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-lg bg-navy-900 text-gray-400"
                    >
                      {r.role.name} ×{r.count}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف سناریو"
        message={`آیا از حذف سناریو «${deleteTarget?.name}» مطمئن هستید؟`}
        confirmText="حذف"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
