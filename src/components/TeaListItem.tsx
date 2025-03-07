import React from 'react';
import { Tea } from '../types/Tea';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

interface TeaListItemProps {
  tea: Tea;
  onDelete: (id: string) => void;
}

const TeaListItem: React.FC<TeaListItemProps> = ({ tea, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${tea.name}?`)) {
      onDelete(tea.id);
    }
  };

  const isLowStock = tea.lowStockThreshold && tea.amount <= tea.lowStockThreshold;

  return (
    <div 
      className={`tea-list-item ${isLowStock ? 'low-stock' : ''}`}
      tabIndex={0}
      role="article"
      aria-label={`${tea.name} tea details`}
    >
      <div className="tea-info">
        <h3>{tea.name}</h3>
        <p className="tea-meta">
          <span className="tea-type">{tea.type}</span>
          <span className="tea-brand">{tea.brand}</span>
        </p>
        <div className="tea-rating">
          <StarRating rating={tea.rating} onChange={() => {}} readOnly />
        </div>
        {tea.flavorTags && tea.flavorTags.length > 0 && (
          <div className="flavor-tags">
            {tea.flavorTags.map(tag => (
              <span key={tag} className="flavor-tag">{tag}</span>
            ))}
          </div>
        )}
        <div className="tea-inventory">
          {tea.amount} {tea.unit} remaining
        </div>
      </div>
      {isLowStock && (
        <div className="low-stock-badge">
          Low Stock
        </div>
      )}
      <div className="tea-actions">
        <Link 
          to={`/tea/${tea.id}`} 
          className="btn btn-view"
          aria-label={`View details for ${tea.name}`}
        >
          View
        </Link>
        <Link 
          to={`/tea/${tea.id}/edit`} 
          className="btn btn-edit"
          aria-label={`Edit ${tea.name}`}
        >
          Edit
        </Link>
        <button 
          onClick={handleDelete} 
          className="btn btn-delete"
          aria-label={`Delete ${tea.name}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TeaListItem;
