import React from 'react';
import { useTea } from '../../contexts/TeaContext';
import { Tea, TeaType } from '../../types/Tea';
import { usePreferences } from '../../contexts/PreferencesContext';
import { PieChart } from 'react-minimal-pie-chart';
import './TeaOverview.css';

const TeaOverview: React.FC = () => {
  const { teas } = useTea();
  const { preferences } = usePreferences();

  const stats = {
    total: teas.length,
    lowStock: teas.filter(t => t.lowStockThreshold && t.amount <= t.lowStockThreshold).length,
    favorites: teas.filter(t => preferences.favoriteTeaIds.includes(t.id)).length,
    types: Object.values(TeaType).reduce((acc, type) => {
      acc[type] = teas.filter(t => t.type === type).length;
      return acc;
    }, {} as Record<TeaType, number>),
  };

  const typeData = Object.entries(stats.types)
    .filter(([_, count]) => count > 0)
    .map(([type, count], index) => ({
      title: type,
      value: count,
      color: `hsl(${index * (360 / Object.keys(stats.types).length)}, 70%, 50%)`
    }));

  return (
    <div className="tea-overview">
      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Total Teas</h3>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card low-stock">
          <h3>Low Stock</h3>
          <div className="stat-value">{stats.lowStock}</div>
        </div>
        <div className="stat-card favorites">
          <h3>Favorites</h3>
          <div className="stat-value">{stats.favorites}</div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>Tea Types Distribution</h3>
          <div className="chart-content">
            <div className="pie-chart">
              <PieChart
                data={typeData}
                radius={42}
                animate
              />
            </div>
            <div className="chart-legend">
              {typeData.map(({ title, value, color }) => (
                <div key={title} className="legend-item">
                  <span className="color-dot" style={{ backgroundColor: color }}/>{' '}
                  <span className="legend-text"><strong>{title}</strong>: {value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeaOverview;
