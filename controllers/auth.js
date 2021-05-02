const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    // Verificar si el email existe
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Pasword no son correctos - correo '
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario / Pasword no son correctos - estado: false'
      });
    }

    // Verificar la contraseña
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Pasword no son correctos - password'
      });
    }

    // Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador'
    });
  }

}

const googleLogin = async(req = request, res = response) => {
  const { id_token } = req.body;
  try {
    const { correo, nombre, img } = await googleVerify(id_token);
    let usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      const data = {
        nombre,
        correo,
        img,
        password: ':P',
        google: true
      }
      usuario = new Usuario(data);
      await usuario.save();
    }

    // Usuario bloqueado en nuestro server
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Usuario bloqueado, hable con el administrador'
      });
    }

    // Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });

  } catch (error) {
    res.status(400).json({
      msg: 'token de Google no es válido'
    });
  }
}
module.exports = {
  login,
  googleLogin
}
