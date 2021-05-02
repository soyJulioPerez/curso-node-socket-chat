const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleLogin } = require('../controllers/auth');

const { validarCampos } =require('../middlewares/validar-campos');

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

module.exports = router;
