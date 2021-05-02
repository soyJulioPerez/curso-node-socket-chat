const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleLogin, renovarToken } = require('../controllers/auth');

const { validarCampos, validarJWT } =require('../middlewares');

const router = Router();

router.post('/login', [
  check('correo', 'Debe enviar un correo valido').isEmail(),
  check('password', 'La contraseña es requerida').not().isEmpty(),
  validarCampos
], login);

router.post('/google', [
  check('id_token', 'El id_token es requerido').not().isEmpty(),
  validarCampos
], googleLogin);

router.get('/', validarJWT, renovarToken);

module.exports = router;
