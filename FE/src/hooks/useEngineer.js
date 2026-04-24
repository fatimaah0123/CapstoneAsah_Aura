import { useState, useEffect } from 'react';
import { fetchAllEngineers, addEngineer } from '../services/engineerService';

const useEngineer = () => {
  const [engineers, setEngineers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: 'Junior Engineer'
  });

  useEffect(() => {
    const loadEngineers = async () => {
      const data = await fetchAllEngineers();
      setEngineers(data);
    };
    loadEngineers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEngineer = {
      ...formData,
      id: formData.id || `ENG-0${engineers.length + 1}`,
      status: 'Active'
    };
    await addEngineer(newEngineer);
    setEngineers([...engineers, newEngineer]);
    setIsModalOpen(false);
    setFormData({ id: '', name: '', email: '', role: 'Junior Engineer' });
  };

  const filteredEngineers = engineers.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    engineers: filteredEngineers,
    totalEngineers: engineers.length,
    isModalOpen, setIsModalOpen,
    searchTerm, setSearchTerm,
    formData,
    handleChange,
    handleSubmit,
  };
};

export default useEngineer;