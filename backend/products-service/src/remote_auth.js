export async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token es requerido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const response = await fetch(`${process.env.AUTH_SERVICE_URL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });

        if (!response.ok) {
            return res.status(401).json({ valid: false, error: 'Token Inválido' });
        } else {
            req.user = await response.json();
            next();
        }
    } catch (error) {
        return res.status(500).json({error: 'Error al verificar autenticación'});
    }
};