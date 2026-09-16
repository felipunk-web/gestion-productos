import 'dotenv/config';
import express from "express";
import mongoose from 'mongoose';
import cors from "cors";
import authRoutes from "./auth_routes.js";
import { findUserByUsername, createUser } from "./auth_repository.js"

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use('/', authRoutes);

mongoose.connect(process.env.DB_URL)
    .then(async () => {
        console.log('Conectado a MongoDB')
        const adminExists = await findUserByUsername('admin')

        if (!adminExists) {
            await createUser({ username: 'admin', password: '1234' })
            console.log('Usuario administrador creado')
        }
    })
    .catch((err) => console.error('Error al conectar a MongoDB', err));

app.listen(port, () => console.log(`Ejecutando en http://localhost:${port}`));