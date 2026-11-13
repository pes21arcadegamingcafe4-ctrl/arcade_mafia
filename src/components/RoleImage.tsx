import type { Role } from '@/types';
import { getSideColor } from '@/lib/sides';

interface RoleImageProps {
  role: Role;
  size?: 'sm' | 'md' | 'lg';
}

export function RoleImage({ role, size = 'md' }: RoleImageProps) {
  const sizes = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
  };

  const initial = role.name.charAt(0);

  if (role.image_url) {
    return (
      <img
        src={role.image_url}
        alt={role.name}
        className={`${sizes[size]} rounded-xl object-cover border border-navy-600`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-xl flex items-center justify-center font-bold border border-navy-600 bg-navy-900 ${getSideColor(role.side)}`}
    >
      {initial}
    </div>
  );
}
