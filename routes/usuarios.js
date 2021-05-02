const { Router } = require('express');
const { check } = require('express-validator');
const Role = require('../models/role');

// const { validarCampos } =require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares');

const { esRoleValido, emailExiste, usuarioExiste } = require('../helpers/db-validators');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom(usuarioExiste),
  check('rol').custom(esRoleValido),
  validarCampos
],usuariosPut);

router.post('/', [
  check('nombre', 'El nombre es requerido').not().isEmpty(),
  check('correo', 'El correo no es válido').isEmail(),
  check('correo').custom(emailExiste),
  check('password', 'El password debe tener por lo menos 6 caracters').isLength({min:6}),
  check('rol').custom(esRoleValido),
  validarCampos
], usuariosPost);

router.delete('/:id', [
  validarJWT,
  // esAdminRole,
  tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom(usuarioExiste),
  validarCampos
],usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;
