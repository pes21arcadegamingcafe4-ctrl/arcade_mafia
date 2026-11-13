import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, ChevronLeft } from 'lucide-react';
import { fetchRoles, deleteRole } from '@/lib/api';
import { RoleImage } from '@/components/RoleImage';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { getSideLabel, getSideColor } from '@/lib/sides';
import type { Role } from '@/types';

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const load = () => {
    fetchRoles()
      .then(setRoles)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRole(deleteTarget.id);
      setRoles((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    } catch (err) {
      console.error(err);
    }
    setDeleteTarget(null);
  };

  const filtered = roles.filter((r) => r.name.includes(search));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">نقش‌ها</h1>
        <Link to="/roles/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          نقش جدید
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
        <input
          className="input-field pr-10"
          placeholder="جستجوی نقش..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">در حال بارگذاری...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-12">هیچ نقشی یافت نشد</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((role) => (
            <div key={role.id} className="card flex items-center gap-3 group">
              <RoleImage role={role} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white truncate">{role.name}</h3>
                  {role.is_default && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-navy-700 text-gray-400">پیش‌فرض</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${getSideColor(role.side)}`}>
                  {getSideLabel(role.side)}
                </p>
                <p className="text-xs text-gray-500 truncate mt-1">{role.description}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  to={`/roles/${role.id}`}
                  className="p-2 rounded-lg text-gray-500 hover:text-gold-500 hover:bg-navy-700 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                {!role.is_default && (
                  <button
                    onClick={() => setDeleteTarget(role)}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-navy-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف نقش"
        message={`آیا از حذف نقش «${deleteTarget?.name}» مطمئن هستید؟`}
        confirmText="حذف"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
