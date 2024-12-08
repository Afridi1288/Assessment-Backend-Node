import { Router } from 'express';
import countryController from '../controllers/countryController';

const router: Router = Router();

// Route for fetching all countries
router.get('/countries', countryController.getAllCountries);

// Route for searching countries by name, capital, region, or timezone
router.get('/countries/search', countryController.searchCountries);

// Route for fetching country by code
router.get('/countries/:code', countryController.getCountryByCode);

// Route for fetching countries by region
router.get('/countries/region/:region', countryController.getCountriesByRegion);


export default router;