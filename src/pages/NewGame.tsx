import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, X, Clapperboard, Users } from 'lucide-react';
import { fetchScenarios, fetchRoles, createGame, buildScenarioWithRoles } from '@/lib/api';
import { shuffle } from '@/lib/shuffle';
import type { Scenario, Role, ScenarioWithRoles } from '@/types';

export function NewGame() {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameName, setGameName] = useState('');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
  const [playerNames, setPlayerNames] = useState<string[]>(['']);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    Promise.all([fetchScenarios(), fetchRoles()])
      .then(([s, r]) => {
        setScenarios(s);
        setRoles(r);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId);
  const detailedScenario: ScenarioWithRoles | null = selectedScenario
    ? buildScenarioWithRoles(selectedScenario, roles)
    : null;

  const requiredPlayers = detailedScenario?.totalPlayers ?? 0;
  const validPlayers = playerNames.filter((n) => n.trim() !== '');
  const playerCount = validPlayers.length;

  const updatePlayerName = (index: number, name: string) => {
    setPlayerNames((prev) => prev.map((n, i) => (i === index ? name : n)));
  };

  const addPlayer = () => {
    setPlayerNames((prev) => [...prev, '']);
  };

  const removePlayer = (index: number) => {
    setPlayerNames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStart = async () => {
    if (!gameName.trim() || !detailedScenario || playerCount !== requiredPlayers) return;
    setStarting(true);

    try {
      const rolePool: string[] = [];
      detailedScenario.roles.forEach((r) => {
        for (let i = 0; i < r.count; i++) {
          rolePool.push(r.role.id);
        }
      });
      const shuffledRoles = shuffle(rolePool);
      const shuffledPlayers = shuffle(validPlayers);

      const assignments = shuffledPlayers.map((name, i) => ({
        player_name: name,
        role_id: shuffledRoles[i],
      }));

      const game = await createGame({
        name: gameName.trim(),
        scenario_id: selectedScenarioId,
        player_names: validPlayers,
        role_assignments: assignments,
        status: 'playing',
      });

      navigate(`/game/${game.id}/distribution`);
    } catch (err) {
      console.error(err);
    }
    setStarting(false);
  };

  const canStart = gameName.trim() && detailedScenario && playerCount === requiredPlayers && playerCount > 0;

  if (loading) {
    return <div className="text-center text-gray-500 py-12">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-white">بازی جدید</h1>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">نام بازی</label>
          <input
            className="input-field"
            placeholder="مثلاً: بازی شب جمعه"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">انتخاب سناریو</label>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-navy-900 border border-navy-600">
              <Clapperboard className="w-5 h-5 text-gold-500" />
              <select
                className="flex-1 bg-transparent text-white outline-none"
                value={selectedScenarioId}
                onChange={(e) => setSelectedScenarioId(e.target.value)}
              >
                <option value="" className="bg-navy-800">انتخاب کنید...</option>
                {scenarios.map((s) => (
                  <option key={s.id} value={s.id} className="bg-navy-800">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            {detailedScenario && (
              <div className="flex items-center gap-4 text-sm text-gray-400 px-1">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-ice-400" />
                  {requiredPlayers} بازیکن
                </span>
                <span className="text-gold-500">
                  {detailedScenario.roles.filter((r) => r.role.side === 'mafia').reduce((s, r) => s + r.count, 0)} مافیا
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">
            بازیکنان {detailedScenario && `( نیاز: ${requiredPlayers} نفر )`}
          </label>
          <button onClick={addPlayer} className="btn-ghost flex items-center gap-1 text-sm">
            <Plus className="w-4 h-4" />
            افزودن
          </button>
        </div>

        <div className="space-y-2">
          {playerNames.map((name, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy-700 text-gray-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {index + 1}
              </span>
              <input
                className="input-field"
                placeholder={`بازیکن ${index + 1}`}
                value={name}
                onChange={(e) => updatePlayerName(index, e.target.value)}
              />
              {playerNames.length > 1 && (
                <button
                  onClick={() => removePlayer(index)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-navy-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {detailedScenario && playerCount !== requiredPlayers && (
          <p className="text-sm text-gold-500">
            تعداد بازیکنان باید {requiredPlayers} نفر باشد ({playerCount} نفر وارد شده)
          </p>
        )}
      </div>

      <button
        onClick={handleStart}
        disabled={!canStart || starting}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Play className="w-5 h-5" />
        {starting ? 'در حال ایجاد...' : 'شروع بازی'}
      </button>
    </div>
  );
}
