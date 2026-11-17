const Producto = require('../models/Producto');

exports.crearProducto = async (req, res) => {
    try {
        const { nombre, precio } = req.body;
        
        // Validación (Soluciona Error Card #8)
        if (!nombre || !precio) {
            return res.status(400).json({ message: 'Nombre y precio son obligatorios' });
        }

        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto' });
    }
};

exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

exports.actualizarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
};

exports.eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
};