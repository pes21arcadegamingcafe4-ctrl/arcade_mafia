import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Skull, Shield, ArrowRight, Trophy, Eye } from 'lucide-react';
import { fetchGames, fetchRoles, updateGame, deleteGame } from '@/lib/api';
import { RoleImage } from '@/components/RoleImage';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { getSideLabel, getSideColor } from '@/lib/sides';
import type { Game, Role } from '@/types';

export function GamePlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [eliminated, setEliminated] = useState<string[]>([]);
  const [showRoles, setShowRoles] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  useEffect(() => {
    Promise.all([fetchGames(), fetchRoles()])
      .then(([games, r]) => {
        const g = games.find((gm) => gm.id === id);
        if (g) {
          setGame(g);
          setRoles(r);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-500 py-12">در حال بارگذاری...</div>;
  }

  if (!game) {
    return <div className="text-center text-gray-500 py-12">بازی یافت نشد</div>;
  }

  const assignments = game.role_assignments;
  const alivePlayers = game.player_names.filter((n) => !eliminated.includes(n));
  const aliveMafia = assignments.filter(
    (a) => !eliminated.includes(a.player_name) && roles.find((r) => r.id === a.role_id)?.side === 'mafia'
  ).length;
  const aliveCitizens = assignments.filter(
    (a) => !eliminated.includes(a.player_name) && roles.find((r) => r.id === a.role_id)?.side === 'citizen'
  ).length;

  const toggleEliminated = (name: string) => {
    setEliminated((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleEndGame = async () => {
    setConfirmEnd(false);
    if (!game) return;
    try {
      await updateGame(game.id, { status: 'finished' });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGame = async () => {
    if (!game) return;
    try {
      await deleteGame(game.id);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const winner =
    aliveMafia === 0 ? 'citizens' :
    aliveMafia >= aliveCitizens ? 'mafia' : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="btn-ghost p-2">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">{game.name}</h1>
        </div>
        <button
          onClick={() => setShowRoles((prev) => !prev)}
          className="btn-ghost flex items-center gap-1 text-sm"
        >
          <Eye className="w-4 h-4" />
          {showRoles ? 'پنهان کردن نقش‌ها' : 'نمایش نقش‌ها'}
        </button>
      </div>

      {winner && (
        <div className={`card text-center animate-scale-in ${winner === 'mafia' ? 'border-gold-700' : 'border-ice-500/50'}`}>
          <Trophy className={`w-12 h-12 mx-auto mb-2 ${winner === 'mafia' ? 'text-gold-500' : 'text-ice-400'}`} />
          <h2 className="text-2xl font-bold text-white">
            {winner === 'mafia' ? 'مافیا برنده شد!' : 'شهروندان برنده شدند!'}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ice-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-ice-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{aliveCitizens}</p>
            <p className="text-xs text-gray-500">شهروندان زنده</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center">
            <Skull className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{aliveMafia}</p>
            <p className="text-xs text-gray-500">مافیا زنده</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-white mb-3">بازیکنان</h3>
        <div className="space-y-2">
          {assignments.map((assignment, i) => {
            const role = roles.find((r) => r.id === assignment.role_id);
            const isEliminated = eliminated.includes(assignment.player_name);
            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isEliminated ? 'bg-navy-900/50 opacity-50' : 'bg-navy-900'
                }`}
              >
                <button
                  onClick={() => toggleEliminated(assignment.player_name)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isEliminated
                      ? 'bg-red-900/50 text-red-400'
                      : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                  }`}
                >
                  {isEliminated ? <Skull className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </button>
                <span className={`flex-1 font-medium ${isEliminated ? 'text-gray-600 line-through' : 'text-white'}`}>
                  {assignment.player_name}
                </span>
                {showRoles && role && (
                  <div className="flex items-center gap-2">
                    <RoleImage role={role} size="sm" />
                    <span className={`text-sm ${getSideColor(role.side)}`}>{role.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/game/${game.id}/distribution`)}
          className="btn-secondary flex-1"
        >
          پخش مجدد نقش‌ها
        </button>
        <button onClick={() => setConfirmEnd(true)} className="btn-danger flex-1">
          پایان بازی
        </button>
      </div>

      <ConfirmDialog
        open={confirmEnd}
        title="پایان بازی"
        message="آیا می‌خواهید این بازی را پایان دهید؟"
        confirmText="پایان"
        onConfirm={handleEndGame}
        onCancel={() => setConfirmEnd(false)}
      />
    </div>
  );
}
