import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Clapperboard, ChevronLeft, TrendingUp } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { fetchGames, fetchRoles, fetchScenarios } from '@/lib/api';
import type { Game, Role, Scenario } from '@/types';

export function Home() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchRoles(), fetchScenarios(), fetchGames()])
      .then(([r, s, g]) => {
        setRoles(r);
        setScenarios(s);
        setGames(g);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeGames = games.filter((g) => g.status !== 'finished');

  const cards = [
    {
      to: '/new-game',
      icon: Play,
      title: 'شروع بازی جدید',
      desc: 'تنظیم بازیکنان و پخش نقش‌ها',
      gradient: 'from-gold-500 to-gold-700',
    },
    {
      to: '/roles',
      icon: Users,
      title: 'مدیریت نقش‌ها',
      desc: `${roles.length} نقش تعریف شده`,
      gradient: 'from-ice-500 to-ice-400',
    },
    {
      to: '/scenarios',
      icon: Clapperboard,
      title: 'سناریوها',
      desc: `${scenarios.length} سناریو آماده`,
      gradient: 'from-gold-400 to-gold-600',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center pt-8">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h1 className="text-4xl font-extrabold text-gradient mb-2">Arcade_Mafia</h1>
        <p className="text-gray-400 text-lg">مدیریت حرفه‌ای بازی مافیا</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              className="card hover:border-gold-700 transition-all group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-1 group-hover:text-gold-500 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500">{loading ? '...' : card.desc}</p>
            </Link>
          );
        })}
      </div>

      {activeGames.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gold-500" />
            <h2 className="text-lg font-bold text-white">بازی‌های فعال</h2>
          </div>
          <div className="space-y-2">
            {activeGames.map((game) => (
              <Link
                key={game.id}
                to={`/game/${game.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-navy-900 hover:bg-navy-700 transition-colors group"
              >
                <div>
                  <p className="font-medium text-white">{game.name}</p>
                  <p className="text-xs text-gray-500">
                    {game.player_names.length} بازیکن · {game.status === 'setup' ? 'در حال تنظیم' : 'در حال انجام'}
                  </p>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gold-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
