const { request, response } = require("express");

const { Categoria } = require("../models");
const query = { estado: true };


const obtenerCategorias = async(req = request, res = response) => {
  const { desde = 0, limite = 0 } = req.query;
  try {
    const categoriasPromise = await Categoria.find(query)
      .populate('usuario', 'nombre')
      .skip(Number(desde))
      .limit(Number(limite));
    const totalPromise = Categoria.countDocuments(query);
    const [total, categorias] = await Promise.all([totalPromise, categoriasPromise]);
    return res.json({ total, desde, limite, categorias });

  } catch (error) {
    console.debug(error);
    return res.status(500).json({
      msg: 'Error consultando categorias'
    });
  }

}

const obtenerCategoria = async(req = request, res = response) => {
  try {
    const id = req.params.id;
    const categoria =  await Categoria.findById(id).populate('usuario', 'nombre');
    return res.json({ categoria });
  } catch (error) {
    console.debug(error);
    res.status(500).json({
      msg: 'Error buscando categoría'
    });
  }
}

const crearCategoria = async(req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({nombre});

  if (categoriaDB) {
    return res.status(400).json({
      msg: `Ya existe una categoría con ese nombre ${nombre}`
    });
  }

  data = {
    nombre,
    usuario: req.usuario._id
  }
  const categoria = new Categoria(data);
  await categoria.save();
  res.status(201).json(categoria);

}

const actualizarCategoria = async(req = request, res = response) => {
  try {
    const id = req.params.id;
    const categoriaData = {
      nombre: req.body.nombre.toUpperCase(),
      usuario: req.usuario._id
    }
    const categoria = await Categoria.findByIdAndUpdate(id, categoriaData, {new: true});
    return res.json(categoria);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error actualizando categoría'
    });
  }
}

const borrarCategoria = async(req = request, res = response) => {
  try {
    const id = req.params.id;
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false});
    res.json({categoria});
  } catch (error) {
    res.status(500).json({
      msg: 'Error borrando categoría'
    });
  }

}

module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria
}
