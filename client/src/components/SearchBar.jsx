import React, { useState } from 'react';
import './SearchBar.css'; // Assuming you have a CSS file for styles

export default function SearchBar({ onSearch, compact }) {
  const [name, setName] = useState('');
  const [continent, setContinent] = useState('');

  const handleSearchClick = () => {
    onSearch({ name, continent });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchClick();
  };

  return (
    <div className={`search-bar ${compact ? 'compact' : ''}`}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Country name"
      />
      <select value={continent} onChange={e => setContinent(e.target.value)}>
        <option value="">All Continents</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
        <option value="Africa">Africa</option>
      </select>
      <button onClick={handleSearchClick}>Search</button>
    </div>
  );
}
