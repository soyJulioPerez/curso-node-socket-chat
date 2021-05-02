const validarCampos = require('./validar-campos');
const validarJWT = require('./validar-jwt');
const validaRoles = require('./validar-roles');
const validarArchivo = require('./validar-archivo');

module.exports = {
  ...validarCampos,
  ...validarJWT,
  ...validaRoles,
  ...validarArchivo
}
