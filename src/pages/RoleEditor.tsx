import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowRight } from 'lucide-react';
import { fetchRoles, createRole, updateRole } from '@/lib/api';
import { SIDES } from '@/lib/sides';
import type { Role, Side } from '@/types';

export function RoleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [name, setName] = useState('');
  const [side, setSide] = useState<Side>('citizen');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    fetchRoles()
      .then((roles) => {
        const role = roles.find((r) => r.id === id);
        if (role) {
          setName(role.name);
          setSide(role.side);
          setDescription(role.description);
          setImageUrl(role.image_url);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const payload = { name: name.trim(), side, description: description.trim(), image_url: imageUrl.trim() };
      if (isEdit && id) {
        await updateRole(id, payload);
      } else {
        await createRole({ ...payload, is_default: false });
      }
      navigate('/roles');
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-12">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/roles')} className="btn-ghost p-2">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'ویرایش نقش' : 'نقش جدید'}</h1>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">نام نقش</label>
          <input
            className="input-field"
            placeholder="مثلاً: کارآگاه"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">طرف</label>
          <div className="flex gap-3">
            {SIDES.map((s) => (
              <button
                key={s.value}
                onClick={() => setSide(s.value)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  side === s.value
                    ? s.value === 'mafia'
                      ? 'bg-gold-500 text-white shadow-gold-glow'
                      : 'bg-ice-500 text-white'
                    : 'bg-navy-700 text-gray-400 hover:bg-navy-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">توضیحات</label>
          <textarea
            className="input-field min-h-[100px] resize-none"
            placeholder="توانایی‌ها و وظایف نقش..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">آدرس تصویر (اختیاری)</label>
          <input
            className="input-field"
            placeholder="https://..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            dir="ltr"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!name.trim() || saving}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'در حال ذخیره...' : 'ذخیره'}
        </button>
      </div>
    </div>
  );
}
