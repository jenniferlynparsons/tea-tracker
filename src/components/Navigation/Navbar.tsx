import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePreferences } from '../../contexts/PreferencesContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { preferences, updatePreferences } = usePreferences();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Cuppa</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Dashboard
        </Link>
        <Link to="/collection" className={location.pathname === '/collection' ? 'active' : ''}>
          Collection
        </Link>
        <Link to="/tea/new" className={location.pathname === '/tea/new' ? 'active' : ''}>
          Add Tea
        </Link>
      </div>
      <div className="navbar-actions">
        <button
          className="theme-toggle"
          onClick={() => updatePreferences({
            theme: preferences.theme === 'light' ? 'dark' : 'light'
          })}
        >
          {preferences.theme === 'light' ? '🫖' : '☕️'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
