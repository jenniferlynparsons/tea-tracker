import React from 'react';
import { Tea } from '../../types/Tea';
import './ShoppingList.css';

interface ShoppingListProps {
  teas: Tea[];
}

const ShoppingList: React.FC<ShoppingListProps> = ({ teas }) => {
  const lowStockTeas = teas
    .filter(tea => tea.lowStockThreshold && tea.amount <= tea.lowStockThreshold)
    .sort((a, b) => (a.amount / (a.lowStockThreshold || 1)) - (b.amount / (b.lowStockThreshold || 1)));

  if (lowStockTeas.length === 0) {
    return (
      <div className="shopping-list empty">
        <h3>Shopping List</h3>
        <p>All teas are well stocked!</p>
      </div>
    );
  }

  return (
    <div className="shopping-list" role="complementary">
      <h3>Shopping List</h3>
      <div className="shopping-items">
        {lowStockTeas.map(tea => (
          <div key={tea.id} className="shopping-item">
            <div className="item-info">
              <span className="item-name">{tea.name}</span>
              <span className="item-brand">{tea.brand}</span>
            </div>
            <div className="item-stock">
              <div className="stock-bar">
                <div 
                  className="stock-level" 
                  style={{ 
                    width: `${(tea.amount / (tea.lowStockThreshold || 1)) * 100}%`,
                    backgroundColor: tea.amount === 0 ? '#ff4444' : '#ffa726'
                  }}
                />
              </div>
              <span className="stock-text">
                {tea.amount} / {tea.lowStockThreshold} {tea.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingList;
