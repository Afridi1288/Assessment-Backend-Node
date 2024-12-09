import express from 'express';
import countryRoutes from './routes/countryRoutes';
import cors from 'cors';

const app = express();
app.use(cors());

const PORT = 3001;

app.use(express.json());

app.use(countryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});