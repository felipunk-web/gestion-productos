import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./products/product_routes.js";
import authRoutes from "./auth/auth_routes.js";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use('/products', productRoutes);
app.use('/', authRoutes);

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB', err));

app.listen(port, () => console.log(`Ejecutando en http://localhost:${port}`));