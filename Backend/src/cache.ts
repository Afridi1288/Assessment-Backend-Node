import NodeCache from 'node-cache';

const countryCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

export default countryCache;