import { useState } from 'react';

const useMachine = () => {
  const [machines, setMachines] = useState([
    { id: 'MC-001', name: 'CNC Milling Machine A1', type: 'Production', status: 'Active' },
    { id: 'MC-002', name: 'Lathe Machine B2', type: 'Production', status: 'Maintenance' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // State Form Baru dengan Suku Cadang Dinamis
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: 'Production',
    spareParts: [{ partName: '', quantity: 1 }] // Array untuk baris suku cadang
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi menambah baris suku cadang
  const addSparePartRow = () => {
    setFormData({
      ...formData,
      spareParts: [...formData.spareParts, { partName: '', quantity: 1 }]
    });
  };

  // Fungsi menghapus baris suku cadang
  const removeSparePartRow = (index) => {
    const updatedParts = formData.spareParts.filter((_, i) => i !== index);
    setFormData({ ...formData, spareParts: updatedParts });
  };

  // Fungsi update item suku cadang spesifik
  const handleSparePartChange = (index, field, value) => {
    const updatedParts = [...formData.spareParts];
    updatedParts[index][field] = value;
    setFormData({ ...formData, spareParts: updatedParts });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMachine = {
      ...formData,
      id: formData.id || `MC-0${machines.length + 1}`,
      status: 'Active'
    };
    setMachines([...machines, newMachine]);
    setIsModalOpen(false);
    setFormData({ id: '', name: '', type: 'Production', spareParts: [{ partName: '', quantity: 1 }] });
  };

  const filteredMachines = machines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    machines: filteredMachines,
    isModalOpen, setIsModalOpen,
    searchTerm, setSearchTerm,
    formData,
    handleChange,
    addSparePartRow,
    removeSparePartRow,
    handleSparePartChange,
    handleSubmit,
  };
};

export default useMachine;