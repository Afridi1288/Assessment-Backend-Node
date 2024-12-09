import React, { useState, useEffect } from 'react';
import { Country } from '../services/countryService';
import { useRouter } from 'next/navigation';

interface CountryCardProps {
  country: Country;
}

const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  const router = useRouter();

  const convertToEtcGMT = (utcOffset: any) => {
    const offset = utcOffset.slice(3); 
  
    const sign = offset[0] === '-' ? '+' : '-';  
    const absOffset = offset.replace(":", "");  
    const hours = parseInt(absOffset.slice(1, 3), 10);
    if (isNaN(hours)) {
      return null;
    }
    return `Etc/GMT${sign}${hours}`;
  };
  
  const calculateTime = (utcOffset: any) => {
    const date = new Date(); 
  
    const timezone = convertToEtcGMT(utcOffset);
  
    if (!timezone) {
      return `Invalid time zone: ${utcOffset}`;
    }
  
    const formattedTime = date.toLocaleString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, 
    });
  
    return formattedTime;
  };

  const goToDetailsPage = () => {
    router.replace(`/${country.name.common}`);
  };

  return (
    <div className="card m-3" style={{ width: '18rem' }}>
      <img src={country.flags.svg} className="card-img-top h-200" alt={`${country.name} flag`} />
      <div className="card-body">
        <h5 className="card-title">{country.name.common}</h5>
        <p className="card-text">{country.region}</p>
        {(country.timezones && country.timezones[0]) && <p className="card-text">Current Time: {calculateTime(country.timezones[0])}</p>}
        <a href='#' onClick={goToDetailsPage}>
            View Details
        </a>
      </div>
    </div>
  );
};

export default CountryCard;
