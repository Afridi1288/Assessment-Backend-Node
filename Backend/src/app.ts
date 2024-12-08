import express from 'express';
import countryRoutes from './routes/countryRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(countryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});