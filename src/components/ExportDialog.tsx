import React, { useState } from 'react';
import { Tea } from '../types/Tea';
import '../styles/ExportDialog.css';

interface ExportDialogProps {
  teas: Tea[];
  onExport: (format: 'json' | 'csv', selectedIds?: string[]) => void;
  onClose: () => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ teas, onExport, onClose }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState<'json' | 'csv'>('json');

  const handleExport = () => {
    onExport(
      format,
      selectedIds.size > 0 ? Array.from(selectedIds) : undefined
    );
    onClose();
  };

  return (
    <div className="export-dialog">
      <h2>Export Tea Collection</h2>
      
      <div className="format-selection">
        <label>
          <input
            type="radio"
            value="json"
            checked={format === 'json'}
            onChange={(e) => setFormat(e.target.value as 'json' | 'csv')}
          />
          JSON (Complete backup)
        </label>
        <label>
          <input
            type="radio"
            value="csv"
            checked={format === 'csv'}
            onChange={(e) => setFormat(e.target.value as 'json' | 'csv')}
          />
          CSV (Spreadsheet compatible)
        </label>
      </div>

      <div className="tea-selection">
        <h3>Select Teas to Export</h3>
        <label>
          <input
            type="checkbox"
            checked={selectedIds.size === teas.length}
            onChange={(e) => {
              setSelectedIds(new Set(e.target.checked ? teas.map(t => t.id) : []));
            }}
          />
          Select All
        </label>
        
        <div className="tea-list">
          {teas.map(tea => (
            <label key={tea.id}>
              <input
                type="checkbox"
                checked={selectedIds.has(tea.id)}
                onChange={(e) => {
                  const newIds = new Set(selectedIds);
                  e.target.checked ? newIds.add(tea.id) : newIds.delete(tea.id);
                  setSelectedIds(newIds);
                }}
              />
              {tea.name}
            </label>
          ))}
        </div>
      </div>

      <div className="dialog-actions">
        <button onClick={handleExport} className="btn btn-primary">
          Export
        </button>
        <button onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ExportDialog;
