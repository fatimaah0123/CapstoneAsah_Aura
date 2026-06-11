import { useState, useEffect, useCallback } from 'react';
import { machineService } from '../services/machineServices';

// Form kosong sesuai field API: name, code, type, location, install_date
const EMPTY_FORM = {
  name:         '',
  code:         '',
  type:         '',
  location:     '',
  install_date: '',
};

const useMachine = () => {
  const [machines, setMachines]     = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget]   = useState(null); // null = mode tambah, object = mode edit
  const [formData, setFormData]       = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError]     = useState('');

  // Konfirmasi hapus
  const [deleteTarget, setDeleteTarget] = useState(null); // id mesin yang akan dihapus

  // ── Fetch list mesin ───────────────────────────────────────────────────────
  const fetchMachines = useCallback(async (search = '') => {
    setIsLoading(true);
    setError('');
    try {
      const data = await machineService.getAll(search);
      setMachines(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data mesin.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch pertama kali
  useEffect(() => {
    fetchMachines();
  }, [fetchMachines]);

  // Search dengan debounce sederhana (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMachines(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchMachines]);

  // ── Buka modal Tambah ──────────────────────────────────────────────────────
  const openAddModal = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setIsModalOpen(true);
  };

  // ── Buka modal Edit ────────────────────────────────────────────────────────
  const openEditModal = (machine) => {
    setEditTarget(machine);
    setFormData({
      name:         machine.name         || '',
      code:         machine.code         || '',
      type:         machine.type         || '',
      location:     machine.location     || '',
      install_date: machine.install_date ? machine.install_date.slice(0, 10) : '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // ── Tutup modal ────────────────────────────────────────────────────────────
  const closeModal = () => {
    setIsModalOpen(false);
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  // ── Handle perubahan input form ────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Submit form (Tambah atau Edit) ─────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      if (editTarget) {
        // Mode Edit → PUT /api/machines/{id}
        const updated = await machineService.update(editTarget.id, formData);
        setMachines((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m))
        );
      } else {
        // Mode Tambah → POST /api/machines
        const created = await machineService.create(formData);
        setMachines((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Hapus mesin ────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await machineService.remove(id);
      setMachines((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus mesin.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return {
    machines,
    isLoading,
    error,
    searchTerm, setSearchTerm,

    // Modal
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

    // Hapus
    deleteTarget, setDeleteTarget,
    handleDelete,
  };
};

export default useMachine;