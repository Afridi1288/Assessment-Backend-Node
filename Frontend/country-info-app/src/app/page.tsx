"use client"; // This marks this file as a client component
import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useState } from 'react';
import { getCountries, Country } from './services/countryService';
import CountryCard from './components/countryCard';
import { Button, Spinner, Input } from 'reactstrap';

const CountryListPage: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [filterRegion, setFilterRegion] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchCountries = async (page: number) => {
    try {
      setLoading(true);
      const data = await getCountries(page, 10);  // Limit to 10 countries per page
      setCountries((prevCountries) => [...prevCountries, ...data]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Error fetching countries.');
    }
  };

  useEffect(() => {
    fetchCountries(page);
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRegion(e.target.value);
  };

  const filteredCountries = countries.filter((country) => {
    const matchesRegion = filterRegion ? country.region === filterRegion : true;
    const matchesSearch = country.name?.common.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="container">
      <h1>Country List</h1>
      
      <div className="d-flex justify-content-between my-3">
        <Input
          type="text"
          placeholder="Search by country name"
          value={searchQuery}
          onChange={handleSearch}
          className="w-50"
        />
        <select className="form-select w-25" onChange={handleFilterChange} value={filterRegion}>
          <option value="">All Regions</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>
      
      {error && <p className="text-danger">{error}</p>}
      
      <div className="d-flex flex-wrap">
        {filteredCountries.map((country, index) => (
          <CountryCard key={index} country={country} />
        ))}
      </div>
      
      <div className="text-center">
        {loading ? (
          <Spinner color="primary" />
        ) : (
          <Button onClick={loadMore}>Load More</Button>
        )}
      </div>
    </div>
  );
};

export default CountryListPage;
