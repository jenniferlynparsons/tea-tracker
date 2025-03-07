import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTea } from '../contexts/TeaContext';
import TeaListItem from '../components/TeaListItem';
import SearchBar from '../components/TeaSearch/SearchBar';
import { TeaType } from '../types/Tea';
import '../styles/TeaListPage.css';
import ExportDialog from '../components/ExportDialog';
import { exportToJson, exportToCsv } from '../utils/exportImport';

const TeaListPage = () => {
  const { teas, deleteTea, exportCollection, importCollection } = useTea();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<TeaType[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [showLowStock, setShowLowStock] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importCollection(file);
      alert('Import successful!');
    } catch (error) {
      alert('Error importing file: ' + (error as Error).message);
    } finally {
      // Reset file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const filteredTeas = teas
    .filter(tea => {
      const matchesSearch = tea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tea.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(tea.type);
      const matchesRating = tea.rating >= minRating;
      const matchesStock = !showLowStock || (tea.lowStockThreshold && tea.amount <= tea.lowStockThreshold);
      
      return matchesSearch && matchesType && matchesRating && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'rating': return b.rating - a.rating;
        case 'stock': return a.amount - b.amount;
        case 'recent': return (b.lastBrewed || '').localeCompare(a.lastBrewed || '');
        default: return 0;
      }
    });

  return (
    <div className="tea-list-page">
      <div className="page-header">
        <h2>My Tea Collection</h2>
        <div className="header-actions">
          <button 
            onClick={handleImportClick}
            className="btn btn-secondary"
          >
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
          <button 
            onClick={() => setShowExportDialog(true)}
            className="btn btn-secondary"
          >
            Export
          </button>
          <Link to="/tea/new" className="btn btn-primary">
            Add New Tea
          </Link>
        </div>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTypes={selectedTypes}
        onTypeChange={setSelectedTypes}
        minRating={minRating}
        onRatingChange={setMinRating}
        showLowStock={showLowStock}
        onLowStockChange={setShowLowStock}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {filteredTeas.length === 0 ? (
        <div className="empty-state">
          <p>No teas found matching your criteria.</p>
          <Link to="/tea/new" className="btn btn-primary">
            Add New Tea
          </Link>
        </div>
      ) : (
        <div className="tea-grid">
          {filteredTeas.map(tea => (
            <TeaListItem
              key={tea.id}
              tea={tea}
              onDelete={deleteTea}
            />
          ))}
        </div>
      )}

      {showExportDialog && (
        <ExportDialog
          teas={teas}
          onExport={exportCollection}
          onClose={() => setShowExportDialog(false)}
        />
      )}
    </div>
  );
};

export default TeaListPage;
