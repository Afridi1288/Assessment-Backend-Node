import axios from 'axios';

export interface Country {
  name: { common: string };
  flags: {svg: string};
  region: string;
  capital: string;
  population: number;
  currencies: { name: string }[];
  languages: string[];
  timezones: string[];
}

const API_URL = "http://localhost:3001";  

export const getCountries = async (page: number, limit: number): Promise<Country[]> => {
  try {
    const response = await axios.get(`${API_URL}/countries?page=${page}&limit=${limit}`, {
      params: {
        _page: page,
        _limit: limit
      }
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch countries.");
  }
};

export const getCountryDetails = async (countryName: string): Promise<Country> => {
  try {
    const response = await axios.get(`${API_URL}/countries/search?name=${countryName}`);
    return response.data[0];
  } catch (error) {
    throw new Error("Failed to fetch country details.");
  }
};
