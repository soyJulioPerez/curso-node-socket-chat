const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const query = {estado: true}

const usuariosGet = async(req = request, res = response) => {
  try {
    const {desde = 0, limite = 5} = req.query;
    const usuariosPromise = Usuario.find(query)
      .skip(Number(desde))
      .limit(Number(limite));
    const totalPromise = Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([totalPromise, usuariosPromise]);
    res.json({total, usuarios});
  } catch (error) {
    console.log(error);
  }

}

const usuariosPost = async (req, res) => {
  const {nombre, correo, password, rol} = req.body;
  const usuario = new Usuario({nombre, correo, password, rol});

  // Encriptar la contraseña
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  // Guardar el usuario
  await usuario.save();

  res.status(201).json(usuario);
}

const usuariosPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...usuarioData } = req.body;

  // TODO validar contra BD

  if (password) {
    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuarioData.password = bcrypt.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, usuarioData);

  res.json(usuario);
};

const usuariosDelete = async(req = request, res = response) => {
  const { id } = req.params;
  const usuarioAutenticado = req.usuario;

  // Borrado Fisico
  // const usuario = await Usuario.findByIdAndDelete(id);

  // Borrado Lógico
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json({usuario, usuarioAutenticado});
};

const usuariosPatch = (req, res) => {
  res.json({
    ok: true,
    msg: 'patch - controlador'
  });
};

module.exports = {
  usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuariosPatch
}
