import 'dotenv/config';
import express from "express";
import * as z from "zod";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

const zodProductSchema = z.object({
    name: z.string().min(2),
    price: z.number().positive(),
    stock: z.number().gte(0)
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
}, { versionKey: false });

const Product = mongoose.model('Product', productSchema, 'products');

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'ID no existente' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/products', requireAuth, async (req, res) => {
    try {
        const result = zodProductSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error.flatten() });
        }
        const product = await Product.create(result.data);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        const result = zodProductSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error.flatten() });
        }
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, result.data, { new: true, runValidators: true });

        if (updatedProduct === null) {
            return res.status(404).json({ message: 'ID no existente' });
        }
        res.json({ message: 'Producto actualizado', updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (deletedProduct === null) {
            return res.status(404).json({ message: 'ID no existente' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '1234') {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token es requerido' });
    }
    try {
        req.user = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB', err));

app.listen(port, () => console.log(`Ejecutando en http://localhost:${port}`));