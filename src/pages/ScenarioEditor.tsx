import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowRight, Plus, Minus } from 'lucide-react';
import { fetchRoles, fetchScenarios, createScenario, updateScenario } from '@/lib/api';
import type { Role, Scenario, ScenarioRoleEntry, Side } from '@/types';

export function ScenarioEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<ScenarioRoleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([fetchRoles(), isEdit ? fetchScenarios() : Promise.resolve([] as Scenario[])])
      .then(([r, s]) => {
        setRoles(r);
        if (isEdit) {
          const scenario = s.find((sc) => sc.id === id);
          if (scenario) {
            setName(scenario.name);
            setDescription(scenario.description);
            setSelectedRoles(scenario.role_ids ?? []);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const totalPlayers = selectedRoles.reduce((sum, r) => sum + r.count, 0);

  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) => {
      const existing = prev.find((r) => r.role_id === roleId);
      if (existing) {
        return prev.filter((r) => r.role_id !== roleId);
      }
      return [...prev, { role_id: roleId, count: 1 }];
    });
  };

  const changeCount = (roleId: string, delta: number) => {
    setSelectedRoles((prev) =>
      prev.map((r) =>
        r.role_id === roleId ? { ...r, count: Math.max(1, r.count + delta) } : r
      )
    );
  };

  const handleSave = async () => {
    if (!name.trim() || totalPlayers === 0) return;
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        role_ids: selectedRoles,
        is_default: false,
      };
      if (isEdit && id) {
        await updateScenario(id, payload);
      } else {
        await createScenario(payload);
      }
      navigate('/scenarios');
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-12">در حال بارگذاری...</div>;
  }

  const mafiaRoles = roles.filter((r) => r.side === 'mafia');
  const citizenRoles = roles.filter((r) => r.side === 'citizen');

  const renderRoleSection = (sectionRoles: Role[], side: Side, label: string, color: string) => (
    <div>
      <h3 className={`text-sm font-bold mb-2 ${color}`}>{label}</h3>
      <div className="space-y-2">
        {sectionRoles.map((role) => {
          const selected = selectedRoles.find((r) => r.role_id === role.id);
          return (
            <div
              key={role.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                selected
                  ? 'bg-navy-700 border-gold-700'
                  : 'bg-navy-900 border-navy-600 hover:border-navy-500'
              }`}
              onClick={() => toggleRole(role.id)}
            >
              <div className={`w-4 h-4 rounded border-2 ${selected ? 'bg-gold-500 border-gold-500' : 'border-navy-500'}`} />
              <span className="flex-1 text-white text-sm">{role.name}</span>
              {selected && (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => changeCount(role.id, -1)}
                    className="w-7 h-7 rounded-lg bg-navy-900 text-gray-400 hover:text-white flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-white font-bold">{selected.count}</span>
                  <button
                    onClick={() => changeCount(role.id, 1)}
                    className="w-7 h-7 rounded-lg bg-navy-900 text-gray-400 hover:text-white flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/scenarios')} className="btn-ghost p-2">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'ویرایش سناریو' : 'سناریو جدید'}</h1>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">نام سناریو</label>
          <input
            className="input-field"
            placeholder="مثلاً: بازی کلاسیک ۱۰ نفره"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">توضیحات</label>
          <input
            className="input-field"
            placeholder="توضیح کوتاه..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="card space-y-4">
        {renderRoleSection(mafiaRoles, 'mafia', 'نقش‌های مافیا', 'text-gold-500')}
        {renderRoleSection(citizenRoles, 'citizen', 'نقش‌های شهروند', 'text-ice-400')}
      </div>

      <div className="card flex items-center justify-between">
        <span className="text-gray-400">تعداد کل بازیکنان:</span>
        <span className="text-2xl font-bold text-gold-500">{totalPlayers}</span>
      </div>

      <button
        onClick={handleSave}
        disabled={!name.trim() || totalPlayers === 0 || saving}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        {saving ? 'در حال ذخیره...' : 'ذخیره سناریو'}
      </button>
    </div>
  );
}
