import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CountryDetail.css";

export default function CountryDetail() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/alpha/${code}`)
      .then((res) => setCountry(res.data[0]))
      .catch(() => setError("Failed to load country details"));
  }, [code]);

  if (error) return <p>{error}</p>;
  if (!country) return <p>Loading...</p>;

  const {
    name,
    capital,
    region,
    subregion,
    population,
    languages,
    currencies,
    flags,
    tld,
    maps,
    timezones,
    area,
    independent,
    unMember,
    altSpellings,
    car,
    startOfWeek,
  } = country;

  return (
    <div className="country-detail-container">
      <h1>Country Details of {name?.common}</h1>
      <img src={flags?.svg} alt={`${name?.common} flag`} width={200} />

      <div className="detail-grid">
        <p>
          <strong>Official Name:</strong> {name?.official}
        </p>
        <p>
          <strong>Capital:</strong> {capital?.[0]}
        </p>
        <p>
          <strong>Region:</strong> {region}
        </p>
        <p>
          <strong>Subregion:</strong> {subregion}
        </p>
        <p>
          <strong>Population:</strong> {population?.toLocaleString()}
        </p>
        <p>
          <strong>Area:</strong> {area} km²
        </p>
        <p>
          <strong>Languages:</strong>{" "}
          {languages ? Object.values(languages).join(", ") : "N/A"}
        </p>
        <p>
          <strong>Currencies:</strong>{" "}
          {currencies
            ? Object.values(currencies)
                .map((c) => `${c.name} (${c.symbol})`)
                .join(", ")
            : "N/A"}
        </p>
        <p>
          <strong>Timezones:</strong> {timezones?.join(", ")}
        </p>
        <p>
          <strong>Top Level Domain:</strong> {tld?.join(", ")}
        </p>
        <p>
          <strong>Independent:</strong> {independent ? "Yes" : "No"}
        </p>
        <p>
          <strong>UN Member:</strong> {unMember ? "Yes" : "No"}
        </p>
        <p>
          <strong>Car Driving Side:</strong> {car?.side}
        </p>
        <p>
          <strong>Alternate Spellings:</strong> {altSpellings?.join(", ")}
        </p>
        <p>
          <strong>Start of Week:</strong> {startOfWeek}
        </p>
        <p>
          <strong>Google Maps:</strong>{" "}
          <a href={maps?.googleMaps} target="_blank" rel="noreferrer">
            View
          </a>
        </p>
        <p>
          <strong>OpenStreetMap:</strong>{" "}
          <a href={maps?.openStreetMaps} target="_blank" rel="noreferrer">
            View
          </a>
        </p>
      </div>
    </div>
  );
}
