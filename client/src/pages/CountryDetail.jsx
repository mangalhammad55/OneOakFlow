import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function CountryDetail() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/countries/${code}`)
      .then(res => setCountry(res.data))
      .catch(() => setError('Failed to load country details'));
  }, [code]);

  if (error) return <p>{error}</p>;
  if (!country) return <p>Loading...</p>;

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Region: {country.region}</p>
      <p>Population: {country.population}</p>
      <p>Languages: {Object.values(country.languages || {}).join(', ')}</p>
      <img src={country.flags?.svg} alt={country.name.common} width={200} />
    </div>
  );
}
