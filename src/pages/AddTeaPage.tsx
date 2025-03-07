import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeaForm from '../components/TeaForm';
import { useTea } from '../contexts/TeaContext';
import { Tea } from '../types/Tea';

const AddTeaPage = () => {
  const navigate = useNavigate();
  const { addTea } = useTea();

  const handleSubmit = (tea: Tea) => {
    addTea(tea);
    navigate('/');
  };

  return (
    <div className="add-tea-page page-container">
      <div className="page-header">
        <h2>Add New Tea</h2>
      </div>
      <div className="page-content">
        <TeaForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
        />
      </div>
    </div>
  );
};

export default AddTeaPage;
