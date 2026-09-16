import 'dotenv/config';
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
};