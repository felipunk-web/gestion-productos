import 'dotenv/config';
import express from "express";
import jwt from "jsonwebtoken";
import { findUserByUsername } from "./auth_repository.js";
import { verifyToken } from "./auth_middleware.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Usuario no existente' });
        }

        if (user.password === password) {
            const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token });
        } else {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/verify', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ error: 'Token requerido' })
    }

    try {
        const verifiedToken = verifyToken(token);
        return res.json({ valid: true, user: verifiedToken });
    } catch (error) {
        return res.status(401).json({valid: false, error: 'Token Inválido'});
    }
});

export default router;