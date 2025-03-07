import React, { useState } from 'react';
import '../styles/StarRating.css';

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onChange, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (readOnly) return;
    
    const star = event.currentTarget;
    const rect = star.getBoundingClientRect();
    const width = rect.width;
    const x = event.clientX - rect.left;
    const isHalfStar = x < width / 2;
    
    setHoverRating(starIndex + (isHalfStar ? 0.5 : 1));
  };
  
  const handleClick = (starIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return;
    
    const star = event.currentTarget;
    const rect = star.getBoundingClientRect();
    const width = rect.width;
    const x = event.clientX - rect.left;
    const isHalfStar = x < width / 2;
    
    onChange(starIndex + (isHalfStar ? 0.5 : 1));
  };

  const renderStar = (index: number) => {
    const currentRating = hoverRating ?? rating;
    const isHalfStar = currentRating - index === 0.5;
    const isFullStar = currentRating - index >= 1;
    
    return (
      <div
        key={index}
        className={`star ${isFullStar ? 'full' : ''} ${isHalfStar ? 'half' : ''} ${readOnly ? 'readonly' : ''}`}
        onMouseMove={(e) => handleMouseMove(e, index)}
        onClick={(e) => handleClick(index, e)}
      >
        ★
      </div>
    );
  };

  return (
    <div 
      className="star-rating"
      onMouseLeave={() => !readOnly && setHoverRating(null)}
    >
      {[...Array(5)].map((_, index) => renderStar(index))}
      <span className="rating-value">({rating})</span>
    </div>
  );
};

export default StarRating;
