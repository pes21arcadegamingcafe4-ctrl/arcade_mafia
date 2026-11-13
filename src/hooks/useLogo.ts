import { useEffect, useState } from 'react';

export function useLogo() {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLogoUrl('/icon-192.png');
    setLoading(false);
  }, []);

  return { logoUrl, loading };
}
