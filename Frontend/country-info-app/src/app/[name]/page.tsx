"use client"; // This marks this file as a client component
import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCountryDetails, Country } from '../services/countryService';

const CountryDetailPage: React.FC = () => {
  const { name } = useParams(); 
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (name) {
      setLoading(true);
      getCountryDetails(name as string)
        .then((data) => {
          setCountry(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load country details.');
          setLoading(false);
        });
    }
  }, [name]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!country) return <div>Country not found.</div>;

  return (
    <div className="container">
      <h1>{country.name.common}</h1>
      <img src={country.flags.svg} alt={country.name.common} style={{ width: '100px' }} />
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <p>Currencies: {Object.keys(country.currencies)}</p>
      <p>Region: {country.region}</p>
      <p>Timezones: {country.timezones.join(', ')}</p>
    </div>
  );
};

export default CountryDetailPage;
