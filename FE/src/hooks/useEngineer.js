import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/engineerService';

// Form untuk Tambah user baru
const EMPTY_ADD_FORM = {
  employee_id: '',
  name:        '',
  email:       '',
  password:    '',
  role:        'Engineer', // default Engineer
};

// Form untuk Edit: hanya name, password, role
// (employee_id & email tidak bisa diubah sesuai API)
const EMPTY_EDIT_FORM = {
  name:     '',
  password: '',
  role:     'Engineer',
};

const useEngineer = () => {
  const [users, setUsers]         = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editTarget, setEditTarget]     = useState(null); // null = mode tambah
  const [formData, setFormData]         = useState(EMPTY_ADD_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError]       = useState('');

  // Konfirmasi hapus
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Fetch users ────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (search = '') => {
    setIsLoading(true);
    setError('');
    try {
      const data = await userService.getAll(search);
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data pengguna.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Search debounce 500ms
  useEffect(() => {
    const t = setTimeout(() => fetchUsers(searchTerm), 500);
    return () => clearTimeout(t);
  }, [searchTerm, fetchUsers]);

  // ── Buka modal Tambah ──────────────────────────────────────────────────────
  const openAddModal = () => {
    setEditTarget(null);
    setFormData(EMPTY_ADD_FORM);
    setFormError('');
    setIsModalOpen(true);
  };

  // ── Buka modal Edit ────────────────────────────────────────────────────────
  const openEditModal = (user) => {
    setEditTarget(user);
    setFormData({
      name:     user.name  || '',
      password: '',          // password dikosongkan, isi hanya jika ingin ganti
      role:     user.role  || 'Engineer',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // ── Tutup modal ────────────────────────────────────────────────────────────
  const closeModal = () => {
    setIsModalOpen(false);
    setEditTarget(null);
    setFormData(EMPTY_ADD_FORM);
    setFormError('');
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Submit (Tambah atau Edit) ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      if (editTarget) {
        // Mode Edit → PUT /api/users/{id}
        // Jika password kosong, jangan kirim field password
        const payload = { name: formData.name, role: formData.role };
        if (formData.password) payload.password = formData.password;

        const updated = await userService.update(editTarget.id, payload);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      } else {
        // Mode Tambah → POST /api/users
        const created = await userService.create(formData);
        setUsers((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Hapus user ─────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await userService.remove(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus pengguna.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return {
    users,
    isLoading,
    error,
    searchTerm, setSearchTerm,

    isModalOpen,
    editTarget,
    formData,
    formError,
    isSubmitting,
    openAddModal,
    openEditModal,
    closeModal,
    handleChange,
    handleSubmit,

    deleteTarget, setDeleteTarget,
    handleDelete,
  };
};

export default useEngineer;