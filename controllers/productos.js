const { request, response } = require("express");
const Producto = require("../models/producto");
const query = { estado: true };

const consultarProductos = async(req = request, res = response) => {
  try {
    const { desde = 0, limite = 5} = req.query;
    const productosPromise = Producto.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate('usuario','nombre')
      .populate('categoria','nombre');
    const totalPromise = Producto.countDocuments(query);
    const [total, productos] = await Promise.all([totalPromise, productosPromise]);
    res.json({ total, productos});
  } catch (error) {
    return res.json({
      msg: 'CONSULTAR productos ',
      error
    });
  }

}

const consultarProducto = async(req = request, res = response) => {
  try {
    const { id } = req.params;
    producto = await Producto.findById(id)
      .populate('categoria', 'nombre')
      .populate('usuario', 'nombre');
    return res.json({ producto });

  } catch (error) {
    console.log(error);
    return res.json({
      msg: 'BUSCAR producto',
      error
    });

  }

}

const crearProducto = async(req = request, res = response) => {
  try {
    const { estado, usuario, ...body } = req.body;
    const productoDB = await Producto.findOne({ nombre: body.nombre});
    if (productoDB) {
      return res.status(400).json({
        msg: `Ya existe un producto con ese nombre ${nombre}`
      });
    }

    const producto = new Producto({ ... body, usuario: req.usuario._id });
    await producto.save();
    res.status(201).json({
      producto
    });
  } catch (error) {
    console.log('🚀 ~ crearProducto ~ error', error);
    return res.json({
      msg: 'Error al crear producto',
      error
    });
  }

}

const actualizarProducto = async(req = request, res = response) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion, disponible } = req.body;
    const data = {
      nombre, precio, descripcion, disponible,
      usuario: req.usuario._id
    };
    producto = await Producto.findByIdAndUpdate(id, data);
    res.json({ producto});

  } catch (error) {
    return res.status(500).json({
      msg: 'Error al actualizar producto',
      error
    });
  }

}

const borrarProducto = async(req = request, res = response) => {
  try {
    const id = req.params.id;
    producto = await Producto.findByIdAndUpdate(id, {estado: false});
    return res.json({ producto });

  } catch (error) {
    console.log('🚀 ~ borrarProducto ~ error', error);
    return res.json({
      msg: 'Error borrando producto',
      error
    });
  }

}

module.exports = {
  consultarProductos,
  consultarProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto
}
