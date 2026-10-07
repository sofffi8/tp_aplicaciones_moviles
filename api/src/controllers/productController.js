// importo los operadores de sequelize
import { Op } from 'sequelize';
import Product from '../models/product.model.js';


// lista de productos
export const getProducts = async (req, res) => {
  try {
    // extrae el parámetro de la página y lo convierte en entero, si no hay, se pone 1 
    const page = parseInt(req.query.page) || 1;
    // define cuantos prod se muestran por página
    const limit = parseInt(req.query.limit) || 5;
    // cuantos productos saltear para mostrar en la sig pagina
    const offset = (page - 1) * limit;

    // extrae el termino de busqueda, el filtro de categoria, la columna para ordenar y el sentido del ordenamiento desde la consulta
    const { search, category, sortBy, order } = req.query;

    // arranca vacío para las condiciones de filtro
    const where = {};

    // si se seleccionó la busqueda
    if (search) {
      // busca productos con coincidencias parciales en el nombre
      where.name = { [Op.like]: `%${search}%` };
    }

    // si se seleccionó categoria
    if (category) {
      // muestra los que tengan exactamente la misma categoria
      where.category = category;
    }

    // campos para ordenar los productos, por precio, nombre, ascendente, descendente
    const validSortFields = ['price', 'name'];
    const validOrders = ['ASC', 'DESC'];

    // verifica si el campo para ordenar que seleccionó el usuario es valido
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'id';
    // verifica si es valido en la lista de ordenes, si es válido lo utiliza, sino usa ascendente
    const sortOrder = validOrders.includes(order?.toUpperCase()) ? order.toUpperCase() : 'ASC';

    // busca los productos que cumplen con los filtros y el orden
    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortField, sortOrder]],
    });

    // calcula el total de paginas
    const totalPages = Math.ceil(count / limit);

    // devuelve los productos en data, y en el objeto paginacion muestra cuantos prod hay, cuantas paginas, en cual pagina está y cuantos prod por pagina
    return res.json({
      estado: true,
      data: rows,
      paginacion: {
        totalItems: count,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: 'Error al obtener productos', error: error.message });
  }
};

// crear producto
export const createProduct = async (req, res) => {
  try {
    // extraigo los campos
    const { name, price, stock, category } = req.body;
    // utiliza el modelo de Product para guardar los datos en la bd
    const nuevoProducto = await Product.create({ name, price, stock, category });
    // devuelve ep producto creado en data
    return res.status(201).json({
      estado: true,
      mensaje: 'Producto creado exitosamente',
      data: nuevoProducto,
    });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: 'Error al crear producto', error: error.message });
  }
};

// actualizar producto
export const updateProduct = async (req, res) => {
  try {
    // toma el id para saber cual necesita cambios
    const { id } = req.params;
    // extrae los campos a actualizar en el producto
    const { name, price, stock, category } = req.body;

    // busca en la bd (en la tabla Product) el producto que coindica con el id
    const producto = await Product.findByPk(id);
    if (!producto) {
      return res.status(404).json({ estado: false, mensaje: 'Producto no encontrado' });
    }

    // guarda los nuevos datos del producto
    await producto.update({ name, price, stock, category });

    // devuelve el producto actualizado correctamente
    return res.json({
      estado: true,
      mensaje: 'Producto actualizado exitosamente',
      data: producto,
    });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: 'Error al actualizar producto', error: error.message });
  }
};

// borrar producto
export const deleteProduct = async (req, res) => {
  try {
    // toma el id para saber cual necesita cambios
    const { id } = req.params;
    // busca en la bd (en la tabla Product) el producto que coindica con el id
    const producto = await Product.findByPk(id);

    if (!producto) {
      return res.status(404).json({ estado: false, mensaje: 'Producto no encontrado' });
    }

    // elimina el producto
    await producto.destroy();

    return res.json({
      estado: true,
      mensaje: 'Producto eliminado exitosamente',
    });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: 'Error al eliminar producto', error: error.message });
  }
};