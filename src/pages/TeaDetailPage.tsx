import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTea } from '../contexts/TeaContext';
import TeaTimer from '../components/TeaTimer';
import { Tea, BrewingHistory } from '../types/Tea';
import StarRating from '../components/StarRating';
import '../styles/TeaDetailPage.css';

const TeaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTea, deleteTea, updateTea } = useTea();
  const [showTimer, setShowTimer] = useState(false);

  const tea = getTea(id!);

  if (!tea) {
    return (
      <div className="error-state">
        <h2>Tea not found</h2>
        <Link to="/" className="btn btn-primary">Back to List</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${tea.name}?`)) {
      deleteTea(tea.id);
      navigate('/');
    }
  };

  const handleBrewComplete = (amountUsed: number) => {
    const newAmount = tea.amount - amountUsed;
    const newHistory: BrewingHistory = {
      date: new Date().toISOString(),
      amount: amountUsed,
      unit: tea.unit
    };

    const updatedTea: Tea = {
      ...tea,
      amount: newAmount,
      lastBrewed: new Date().toISOString(),
      totalBrewCount: (tea.totalBrewCount || 0) + 1,
      brewingHistory: [...(tea.brewingHistory || []), newHistory]
    };

    updateTea(updatedTea);
    setShowTimer(false);
  };

  const isLowStock = tea.lowStockThreshold && tea.amount <= tea.lowStockThreshold;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{tea.name}</h2>
        <div className="header-actions">
          <Link to={`/tea/${id}/edit`} className="btn btn-edit">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-delete">
            Delete
          </button>
        </div>
      </div>
      <div className="page-content">
        {showTimer ? (
          <TeaTimer
            tea={tea}
            onComplete={handleBrewComplete}
            onCancel={() => setShowTimer(false)}
          />
        ) : (
          <button 
            onClick={() => setShowTimer(true)}
            className="btn btn-primary brew-button"
            disabled={tea.amount <= 0}
          >
            Make a Cuppa
          </button>
        )}

        {isLowStock && (
          <div className="low-stock-alert">
            Low stock alert! Only {tea.amount} {tea.unit} remaining
          </div>
        )}

        <section className="tea-detail-section basic-info">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Brand:</label>
              <span>{tea.brand}</span>
            </div>
            <div className="info-item">
              <label>Type:</label>
              <span>{tea.type}</span>
            </div>
            <div className="info-item">
              <label>Form:</label>
              <span>{tea.form}</span>
            </div>
            <div className="info-item">
              <label>Rating:</label>
              <span>★ {tea.rating}</span>
            </div>
          </div>
        </section>

        <section className="tea-detail-section inventory">
          <h3>Inventory</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Amount:</label>
              <span>{tea.amount} {tea.unit}</span>
            </div>
          </div>
        </section>

        <section className="tea-detail-section brewing">
          <h3>Brewing Instructions</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Temperature:</label>
              <span>{tea.brewingInstructions.temperature}°{tea.brewingInstructions.tempUnit}</span>
            </div>
            <div className="info-item">
              <label>Steep Time:</label>
              <span>{Math.floor(tea.brewingInstructions.steepTimeInSeconds / 60)} minutes</span>
            </div>
          </div>
        </section>

        {tea.tastingNotes && (
          <section className="tea-detail-section">
            <h3>Tasting Notes</h3>
            <p>{tea.tastingNotes}</p>
          </section>
        )}

        {tea.notes && (
          <section className="tea-detail-section">
            <h3>Additional Notes</h3>
            <p>{tea.notes}</p>
          </section>
        )}

        <section className="tea-detail-section brewing-history">
          <h3>Brewing History</h3>
          {tea.brewingHistory && tea.brewingHistory.length > 0 ? (
            <div className="history-list">
              {tea.brewingHistory.slice().reverse().map((brew, index) => (
                <div key={index} className="history-item">
                  <span className="history-date">
                    {new Date(brew.date).toLocaleDateString()}
                  </span>
                  <span className="history-amount">
                    {brew.amount} {brew.unit}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No brewing history yet</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default TeaDetailPage;
