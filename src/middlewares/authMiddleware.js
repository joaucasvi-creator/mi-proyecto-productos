const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Buscamos el token en los headers
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
    }

    try {
        // El token usualmente viene como "Bearer <token>", así que lo separamos
        const tokenLimpio = token.replace('Bearer ', '');
        const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
        req.usuario = verificado; // Guardamos los datos del usuario en la request
        next(); // Damos paso al controlador
    } catch (error) {
        res.status(400).json({ message: 'Token no válido' });
    }
};