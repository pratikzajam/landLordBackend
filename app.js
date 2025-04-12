import express from 'express';
import 'dotenv/config';
import routes from './src/routes/route.js';
import connectDB from './dbConnection.js';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Define custom CORS options
const corsOptions = {
  origin: "*", // Allow these origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Enable this if you're using cookies or authorization headers
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

const uploadPath = path.join(process.cwd(), 'src', 'uploads');
app.use('/uploads', express.static(uploadPath));

app.use(express.json());
app.use('/', routes);

// Connect to DB and start server
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
