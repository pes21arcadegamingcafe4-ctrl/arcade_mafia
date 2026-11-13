import { NavLink } from 'react-router-dom';
import { Chrome as Home, Users, Clapperboard, Play, Settings } from 'lucide-react';
import { Logo } from './Logo';

const navItems = [
  { to: '/', label: 'خانه', icon: Home },
  { to: '/roles', label: 'نقش‌ها', icon: Users },
  { to: '/scenarios', label: 'سناریوها', icon: Clapperboard },
  { to: '/new-game', label: 'بازی جدید', icon: Play },
  { to: '/settings', label: 'تنظیمات', icon: Settings },
];

export function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-navy-800/95 backdrop-blur-md border-t border-navy-600 md:top-0 md:bottom-auto md:border-t-0 md:border-b md:h-16">
      <div className="hidden md:flex items-center justify-between h-full px-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-bold text-lg text-gradient">Arcade_Mafia</span>
        </div>
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'text-gold-500 bg-navy-700'
                      : 'text-gray-400 hover:text-white hover:bg-navy-700/50'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="flex md:hidden items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-all flex-1 ${
                  isActive ? 'text-gold-500' : 'text-gray-500'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
