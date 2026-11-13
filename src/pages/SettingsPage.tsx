import { useState } from 'react';
import { Trash2, Download, Upload, Info } from 'lucide-react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { supabase } from '@/lib/supabase';

export function SettingsPage() {
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetData = async () => {
    setConfirmReset(false);
    try {
      await supabase.from('games').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('scenarios').delete().eq('is_default', false);
      await supabase.from('roles').delete().eq('is_default', false);
      setMessage('داده‌های سفارشی پاک شد');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('خطا در پاک کردن داده‌ها');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleExport = async () => {
    try {
      const [rolesRes, scenariosRes, gamesRes] = await Promise.all([
        supabase.from('roles').select('*'),
        supabase.from('scenarios').select('*'),
        supabase.from('games').select('*'),
      ]);

      const data = {
        roles: rolesRes.data ?? [],
        scenarios: scenariosRes.data ?? [],
        games: gamesRes.data ?? [],
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mafia-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('داده‌ها صادر شدند');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('خطا در صادرت داده‌ها');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-white">تنظیمات</h1>

      {message && (
        <div className="card text-center text-gold-500 animate-fade-in">
          {message}
        </div>
      )}

      <div className="card space-y-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Info className="w-5 h-5" />
          <h3 className="font-bold text-white">مدیریت داده‌ها</h3>
        </div>
        <p className="text-sm text-gray-500">
          داده‌های بازی در فضای ابری ذخیره می‌شوند. می‌توانید نسخه پشتیبان تهیه کنید یا داده‌های سفارشی را پاک کنید.
        </p>

        <div className="flex gap-3">
          <button onClick={handleExport} className="btn-secondary flex-1 flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            صادرات داده
          </button>
          <button onClick={() => setConfirmReset(true)} className="btn-danger flex-1 flex items-center justify-center gap-2">
            <Trash2 className="w-5 h-5" />
            پاک کردن داده‌های سفارشی
          </button>
        </div>
      </div>

      <div className="card space-y-2">
        <h3 className="font-bold text-white">درباره برنامه</h3>
        <p className="text-sm text-gray-500">
          Arcade_Mafia — مدیریت حرفه‌ای بازی مافیا
        </p>
        <p className="text-xs text-gray-600">نسخه ۱.۰.۰</p>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="پاک کردن داده‌ها"
        message="همه بازی‌ها، سناریوهای سفارشی و نقش‌های سفارشی پاک خواهند شد. نقش‌ها و سناریوهای پیش‌فرض باقی می‌مانند. این عمل قابل بازگشت نیست!"
        confirmText="پاک کن"
        onConfirm={handleResetData}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
