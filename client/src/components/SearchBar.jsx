import React, { useState, useEffect, useCallback, useRef } from "react";
import debounce from "lodash/debounce";
import "./SearchBar.css";

export default function SearchBar({ onSearch, compact }) {
  const [name, setName] = useState("");
  const [continent, setContinent] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const skipDebounceRef = useRef(false);

  const fetchSuggestions = async (term) => {
    if (!term) return setSuggestions([]);
    try {
      const res = await fetch(
        `http://localhost:5000/api/countries/suggestions?name=${term}`
      );
      const data = await res.json();
      setSuggestions(data.slice(0, 5));
    } catch {
      setSuggestions([]);
    }
  };

  const debouncedFetch = useCallback(
    debounce((value) => fetchSuggestions(value), 400),
    []
  );

  useEffect(() => {
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }
    debouncedFetch(name);
    return debouncedFetch.cancel;
  }, [name]);

  const handleSuggestionClick = (suggestion) => {
    skipDebounceRef.current = true;
    setName(suggestion);
    setSuggestions([]);
  };

  const handleSearchClick = () => {
    setSuggestions([]);
    onSearch({ name, continent });
  };

  return (
    <div className={`search-bar ${compact ? "compact" : ""}`}>
      <div style={{ position: "relative" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Country name"
        />
        {suggestions.length > 0 && (
          <ul className="suggestion-dropdown">
            {suggestions.map((s, i) => (
              <li key={i} onClick={() => handleSuggestionClick(s)}>
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <select value={continent} onChange={(e) => setContinent(e.target.value)}>
        <option value="">All Continents</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
        <option value="Africa">Africa</option>
      </select>
      <button onClick={handleSearchClick}>Search</button>
    </div>
  );
}
