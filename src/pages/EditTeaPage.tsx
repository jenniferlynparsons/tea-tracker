import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeaForm from '../components/TeaForm';
import { useTea } from '../contexts/TeaContext';
import { Tea } from '../types/Tea';

const EditTeaPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTea, updateTea } = useTea();

  const tea = getTea(id!);

  if (!tea) {
    return (
      <div className="error-state">
        <h2>Tea not found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to List
        </button>
      </div>
    );
  }

  const handleSubmit = (updatedTea: Tea) => {
    updateTea(updatedTea);
    navigate(`/tea/${id}`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Edit {tea.name}</h2>
      </div>
      <div className="page-content">
        <TeaForm
          initialTea={tea}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/tea/${id}`)}
        />
      </div>
    </div>
  );
};

export default EditTeaPage;
