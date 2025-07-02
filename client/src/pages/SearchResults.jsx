import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import './SearchResults.css'; // Assuming you have a CSS file for styles

export default function SearchResults() {
  const [countries, setCountries] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(location.search);
      if (sortBy) query.set('sortBy', sortBy);
      const { data } = await axios.get(`http://localhost:5000/api/countries/search?${query.toString()}`);
      setCountries(data.results);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError('Failed to fetch countries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pageParam = new URLSearchParams(location.search).get('page');
    setPage(parseInt(pageParam) || 1);
    fetchCountries();
  }, [location.search, sortBy]);

  const handlePageChange = (newPage) => {
    const query = new URLSearchParams(location.search);
    query.set('page', newPage);
    navigate(`/search?${query.toString()}`);
  };

  return (
    <div className="search-results">
      <SearchBar
        onSearch={({ name, continent }) => {
          const params = new URLSearchParams();
          if (name) params.set('name', name);
          if (continent) params.set('continent', continent);
          navigate(`/search?${params.toString()}`);
        }}
        compact={true}
      />
    <div className="sort-wrapper" style={{ display: "flex", justifyContent: "flex-end"}}>
        <select onChange={e => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="capital">Capital</option>
            <option value="currency">Currency</option>
        </select>
    </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && countries.length === 0 && <p>No countries found.</p>}

      <div className="card-grid">
        {countries.map(c => (
          <div key={c.cca2} className="card" onClick={() => navigate(`/country/${c.cca2}`)}>
            <div className="flag">{c.flag}</div>
            <h3>{c.name}</h3>
            <p><strong>Capital:</strong> {c.capital}</p>
            <p><strong>Currency:</strong> {c.currencies.join(', ')}</p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
  <div className="pagination">
    <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>Previous</button>
    <span>Page {page} of {totalPages}</span>
    <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>Next</button>
  </div>
)}
    </div>
  );
}