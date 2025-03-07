import React from 'react';
import { TeaType } from '../../types/Tea';
import './SearchBar.css';
import { useLoading } from '../../hooks/useLoading';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTypes: TeaType[];
  onTypeChange: (types: TeaType[]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  showLowStock: boolean;
  onLowStockChange: (show: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedTypes,
  onTypeChange,
  minRating,
  onRatingChange,
  showLowStock,
  onLowStockChange,
  sortBy,
  onSortChange,
}) => {
  const { isLoading, error } = useLoading();

  return (
    <div 
      className="search-bar" 
      role="search"
      aria-label="Tea search and filters"
    >
      <div className="search-input">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search teas..."
          aria-label="Search teas"
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="error-message" role="alert">
          Failed to update search: {error.message}
        </div>
      )}

      <div className="filter-group" role="group" aria-label="Tea filters">
        <select
          multiple
          value={selectedTypes}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(
              option => option.value as TeaType
            );
            onTypeChange(selected);
          }}
          aria-label="Filter by tea type"
        >
          {Object.values(TeaType).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select value={minRating} onChange={(e) => onRatingChange(Number(e.target.value))} aria-label="Filter by minimum rating">
          <option value="0">All Ratings</option>
          {[1, 2, 3, 4, 5].map(rating => (
            <option key={rating} value={rating}>{rating}+ Stars</option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            checked={showLowStock}
            onChange={(e) => onLowStockChange(e.target.checked)}
            aria-label="Show low stock"
          />
          Show Low Stock
        </label>

        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} aria-label="Sort by">
          <option value="name">Name</option>
          <option value="rating">Rating</option>
          <option value="stock">Stock Level</option>
          <option value="recent">Recently Brewed</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
