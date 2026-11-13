import { useLogo } from '@/hooks/useLogo';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const { logoUrl, loading } = useLogo();

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
  };

  if (loading) {
    return <div className={`${sizes[size]} rounded-xl bg-navy-700 animate-pulse`} />;
  }

  return (
    <img
      src={logoUrl}
      alt="Mafia Logo"
      className={`${sizes[size]} rounded-xl object-cover shadow-gold-glow`}
    />
  );
}
