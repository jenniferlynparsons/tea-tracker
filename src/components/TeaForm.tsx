import React, { useState } from 'react';
import { Tea, TeaType, TeaForm as TeaFormType, Unit, TemperatureUnit, CaffeineLevel, FlavorProfile } from '../types/Tea';
import StarRating from './StarRating';
import { v4 as uuidv4 } from 'uuid';
import '../styles/forms.css';

interface TeaFormProps {
  initialTea?: Tea;
  onSubmit: (tea: Tea) => void;
  onCancel: () => void;
}

const defaultTea: Partial<Tea> = {
  type: TeaType.Black,
  form: TeaFormType.LooseLeaf,
  unit: Unit.Grams,
  rating: 0,
  brewingInstructions: {
    temperature: 95,
    tempUnit: TemperatureUnit.Celsius,
    steepTimeInSeconds: 180,
  },
};

const TeaForm: React.FC<TeaFormProps> = ({ initialTea, onSubmit, onCancel }) => {
  const [tea, setTea] = useState<Partial<Tea>>(initialTea || defaultTea);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!tea.name?.trim()) newErrors.name = 'Name is required';
    if (!tea.brand?.trim()) newErrors.brand = 'Brand is required';
    if (tea.amount === undefined || tea.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const finalTea: Tea = {
        id: tea.id || uuidv4(),
        name: tea.name!,
        brand: tea.brand!,
        type: tea.type!,
        form: tea.form!,
        amount: tea.amount!,
        unit: tea.unit!,
        rating: tea.rating!,
        tastingNotes: tea.tastingNotes || '',
        brewingInstructions: tea.brewingInstructions!,
        ...tea,
      };
      onSubmit(finalTea);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tea-form" role="form" aria-label="Tea Form">
      <div className="form-section">
        <h3 id="basic-info">Basic Information</h3>
        <div className="form-row" role="group" aria-labelledby="basic-info">
          <div className="form-group">
            <label>Name*</label>
            <input
              type="text"
              value={tea.name || ''}
              onChange={e => setTea({ ...tea, name: e.target.value })}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Brand*</label>
            <input
              type="text"
              value={tea.brand || ''}
              onChange={e => setTea({ ...tea, brand: e.target.value })}
            />
            {errors.brand && <span className="error">{errors.brand}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select
              value={tea.type}
              onChange={e => setTea({ ...tea, type: e.target.value as TeaType })}
            >
              {Object.values(TeaType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Form</label>
            <select
              value={tea.form}
              onChange={e => setTea({ ...tea, form: e.target.value as TeaFormType })}
            >
              {Object.values(TeaFormType).map(form => (
                <option key={form} value={form}>{form}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Amount*</label>
            <div className="input-group">
              <input
                type="number"
                value={tea.amount || ''}
                onChange={e => setTea({ ...tea, amount: parseFloat(e.target.value) })}
              />
              <select
                value={tea.unit}
                onChange={e => setTea({ ...tea, unit: e.target.value as Unit })}
              >
                {Object.values(Unit).map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            {errors.amount && <span className="error">{errors.amount}</span>}
          </div>
          <div className="form-group">
            <label>Rating</label>
            <StarRating
              rating={tea.rating || 0}
              onChange={(rating) => setTea({ ...tea, rating })}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 id="brewing-info">Brewing Instructions</h3>
        <div className="form-row" role="group" aria-labelledby="brewing-info">
          <div className="form-group">
            <label>Temperature</label>
            <div className="input-group">
              <input
                type="number"
                value={tea.brewingInstructions?.temperature || ''}
                onChange={e => setTea({
                  ...tea,
                  brewingInstructions: {
                    ...tea.brewingInstructions!,
                    temperature: parseFloat(e.target.value)
                  }
                })}
              />
              <select
                value={tea.brewingInstructions?.tempUnit}
                onChange={e => setTea({
                  ...tea,
                  brewingInstructions: {
                    ...tea.brewingInstructions!,
                    tempUnit: e.target.value as TemperatureUnit
                  }
                })}
              >
                {Object.values(TemperatureUnit).map(unit => (
                  <option key={unit} value={unit}>°{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Steep Time (minutes)</label>
            <input
              type="number"
              value={tea.brewingInstructions?.steepTimeInSeconds ? tea.brewingInstructions.steepTimeInSeconds / 60 : ''}
              onChange={e => setTea({
                ...tea,
                brewingInstructions: {
                  ...tea.brewingInstructions!,
                  steepTimeInSeconds: parseFloat(e.target.value) * 60
                }
              })}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 id="flavor-profile">Flavor Profile</h3>
        <div 
          className="flavor-tags" 
          role="group" 
          aria-labelledby="flavor-profile"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              const target = e.target as HTMLInputElement;
              if (target.type === 'checkbox') {
                target.click();
              }
            }
          }}
        >
          {Object.values(FlavorProfile).map(flavor => (
            <label key={flavor} className="flavor-tag">
              <input
                type="checkbox"
                checked={tea.flavorTags?.includes(flavor) || false}
                onChange={(e) => {
                  const newTags = e.target.checked
                    ? [...(tea.flavorTags || []), flavor]
                    : (tea.flavorTags || []).filter(t => t !== flavor);
                  setTea({ ...tea, flavorTags: newTags });
                }}
              />
              {flavor}
            </label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h3>Notes</h3>
        <div className="form-group">
          <label>Tasting Notes</label>
          <textarea
            value={tea.tastingNotes || ''}
            onChange={e => setTea({ ...tea, tastingNotes: e.target.value })}
            placeholder="Describe the aroma, taste, and overall experience..."
            rows={4}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialTea ? 'Update Tea' : 'Add Tea'}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn btn-secondary"
          aria-label="Cancel form"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TeaForm;
