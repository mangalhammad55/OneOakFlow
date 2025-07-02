
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import './Home.css'; // Assuming you have a CSS file for styles

export default function Home() {
  const navigate = useNavigate();

  const handleSearch = ({ name, continent }) => {
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (continent) params.set('continent', continent);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="home">
      <div className="overlay-background">
        <div>
        <h2 >Welcome to the Country Search App</h2>
        <h3 >Find information about countries around the world.</h3>
        </div>
        <SearchBar onSearch={handleSearch} compact={false} />
      </div>
    </div>
  );
}

