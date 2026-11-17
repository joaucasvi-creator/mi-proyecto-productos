const productoController = require('../src/controllers/productoController');
const Producto = require('../src/models/Producto');

// Mockeamos el modelo de Mongoose para que Jest no intente conectar a la BD real
jest.mock('../src/models/Producto');

describe('Controlador de Productos - Pruebas Unitarias', () => {
  
  test('Debe retornar error 400 si faltan datos obligatorios (nombre o precio)', async () => {
    const req = { body: {} }; // Petición vacía
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await productoController.crearProducto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Nombre y precio son obligatorios' });
  });

  test('Debe crear un producto correctamente y retornar 201', async () => {
    const req = { body: { nombre: 'Laptop HP', precio: 15000 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Simulamos la instancia del modelo
    Producto.mockImplementationOnce(() => ({
      ...req.body, 
      save: jest.fn().mockResolvedValue(true) 
    }));

    await productoController.crearProducto(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    // Comparamos que el JSON enviado contenga los datos del req.body
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(req.body)); 
  });

  test('Debe retornar 500 si hay un error en la base de datos al obtener productos', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Simulamos que la BD falla
    Producto.find = jest.fn().mockRejectedValue(new Error('Fallo en la BD'));

    await productoController.obtenerProductos(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener productos' });
  });
});