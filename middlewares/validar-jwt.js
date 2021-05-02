const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {
  const token = req.header('x-token');
  if (!token) {
    return res.status(401).json({
      msg: 'Token NO valido - No hay token'
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const usuario = await Usuario.findById(uid);
    req.usuario = usuario;

    if (!usuario) {
      return res.status(401).json({
        msg: 'Token NO valido - usuario NO existe en DB'
      });
    }
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Token NO valido - usuario con estado: false'
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      msg: 'Token NO valido'
    });
  }

}

module.exports = {
  validarJWT
}
