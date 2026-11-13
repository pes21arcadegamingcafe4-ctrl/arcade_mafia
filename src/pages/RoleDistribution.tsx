import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { fetchGames, fetchRoles } from '@/lib/api';
import { RoleImage } from '@/components/RoleImage';
import { getSideLabel, getSideColor } from '@/lib/sides';
import type { Game, Role } from '@/types';

export function RoleDistribution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [seenPlayers, setSeenPlayers] = useState<string[]>([]);

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
  const total = assignments.length;

  if (currentIndex >= total) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-gold-500/20 flex items-center justify-center">
          <Check className="w-10 h-10 text-gold-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">پخش نقش‌ها کامل شد</h2>
        <p className="text-gray-400">همه بازیکنان نقش خود را دیدند</p>
        <button
          onClick={() => navigate(`/game/${game.id}`)}
          className="btn-primary flex items-center gap-2"
        >
          شروع بازی
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const assignment = assignments[currentIndex];
  const role = roles.find((r) => r.id === assignment.role_id);
  const playerName = assignment.player_name;

  const handleNext = () => {
    setSeenPlayers((prev) => [...prev, playerName]);
    setCurrentIndex((prev) => prev + 1);
    setRevealed(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
      <div className="text-center">
        <p className="text-gray-500 text-sm mb-1">بازیکن {currentIndex + 1} از {total}</p>
        <h2 className="text-3xl font-bold text-white">{playerName}</h2>
      </div>

      <div className="w-full max-w-sm">
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="w-full aspect-[3/4] rounded-3xl bg-gradient-to-br from-navy-700 to-navy-900 border-2 border-gold-700 flex flex-col items-center justify-center gap-4 hover:border-gold-500 transition-all hover:shadow-gold-glow-lg active:scale-95"
          >
            <Eye className="w-16 h-16 text-gold-500" />
            <p className="text-gold-500 font-bold text-lg">برای دیدن نقش ضربه بزن</p>
            <p className="text-gray-600 text-sm">مطمئن شو فقط خودت می‌بینی</p>
          </button>
        ) : (
          <div className="w-full aspect-[3/4] rounded-3xl bg-gradient-to-br from-navy-700 to-navy-900 border-2 border-gold-500 flex flex-col items-center justify-center gap-4 animate-scale-in p-6">
            {role && <RoleImage role={role} size="lg" />}
            <h3 className="text-2xl font-bold text-white">{role?.name}</h3>
            <p className={`text-lg font-bold ${getSideColor(role?.side ?? 'citizen')}`}>
              {getSideLabel(role?.side ?? 'citizen')}
            </p>
            <p className="text-sm text-gray-400 text-center leading-relaxed">{role?.description}</p>
            <button
              onClick={() => setRevealed(false)}
              className="text-gray-500 text-sm flex items-center gap-1 hover:text-white transition-colors mt-2"
            >
              <EyeOff className="w-4 h-4" />
              پنهان کن
            </button>
          </div>
        )}
      </div>

      {revealed && (
        <button onClick={handleNext} className="btn-primary flex items-center gap-2">
          بازیکن بعدی
          <ArrowRight className="w-5 h-5" />
        </button>
      )}

      {seenPlayers.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center max-w-sm">
          {seenPlayers.map((p, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-lg bg-navy-700 text-gray-500 flex items-center gap-1">
              <Check className="w-3 h-3 text-gold-500" />
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
