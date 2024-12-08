import axios from 'axios';
import { Request, Response } from 'express';
import countryCache from '../cache';

const API_URL = 'https://restcountries.com/v3.1';

interface Country {
    name: { common: string };
    capital?: string[];
    region: string;
    timezones?: string[];
    flags: { png: string };
    population: number;
    currencies: { [key: string]: { name: string } };
  }
  
  // Helper function to fetch all countries data from the REST API
  const fetchCountriesData = async (): Promise<Country[]> => {
    try {
      const response = await axios.get<Country[]>(`${API_URL}/all?fields=name,region,capital,timezones`);
      return response.data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw new Error('Failed to fetch countries data in commom API caller');
    }
  };
  
  // Controller to get all countries
  const getAllCountries = async (req: Request, res: Response): Promise<any> => {
    const cachedData = countryCache.get<Country[]>('allCountries');
    if (cachedData) {
      return res.json(cachedData);
    }
  
    try {
      const countries = await fetchCountriesData();
      countryCache.set('allCountries', countries);
      return res.json(countries);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch countries data' });
    }
  };
  
  // Controller to get a single country by its code
  const getCountryByCode = async (req: Request, res: Response): Promise<any> => {
    const { code } = req.params;
  
    const cachedData = countryCache.get<Country>(`country-${code}`);
    if (cachedData) {
      return res.json(cachedData);
    }
  
    try {
      const response = await axios.get<Country[]>(`${API_URL}/alpha/${code}`);
      if (response.data && response.data.length > 0) {
        const country = response.data[0];
        countryCache.set(`country-${code}`, country);
        return res.json(country);
      } else {
        return res.status(404).json({ error: 'Country not found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch country data in getCountryByCode controller' });
    }
  };
  
  // Controller to get countries by region
  const getCountriesByRegion = async (req: Request, res: Response): Promise<any> => {
    const { region } = req.params;
  
    const cachedData = countryCache.get<Country[]>(`region-${region}`);
    if (cachedData) {
      return res.json(cachedData);
    }
  
    try {
      const countries = await fetchCountriesData();
      const filteredCountries = countries.filter(country => country.region === region);
  
      if (filteredCountries.length > 0) {
        countryCache.set(`region-${region}`, filteredCountries);
        return res.json(filteredCountries);
      } else {
        return res.status(404).json({ error: `No countries found for region: ${region}` });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch countries data' });
    }
  };
  
  // Controller for searching countries by various parameters
  const searchCountries = async (req: Request, res: Response): Promise<any> => {
    const { name, capital, region, timezone } = req.query;
  
    const cacheKey = `search-${JSON.stringify(req.query)}`;
    const cachedData = countryCache.get<Country[]>(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
  
    try {
      const countries = await fetchCountriesData();
      let result = countries;
  
      if (name) {
        result = result.filter(country => country.name.common.toLowerCase().includes(name.toString().toLowerCase()));
      }
  
      if (capital) {
        result = result.filter(country => country.capital && country.capital.some(c => c.toLowerCase().includes(capital.toString().toLowerCase())));
      }
  
      if (region) {
        result = result.filter(country => country.region.toLowerCase().includes(region.toString().toLowerCase()));
      }
  
      if (timezone) {
        result = result.filter(country => country.timezones && country.timezones.some(tz => tz === timezone));
      }
  
      if (result.length > 0) {
        countryCache.set(cacheKey, result);
        return res.json(result);
      } else {
        return res.status(404).json({ error: 'No countries found for the search criteria' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch countries data in controller' });
    }
  };
  
  export default {
    getAllCountries,
    getCountryByCode,
    getCountriesByRegion,
    searchCountries
  };