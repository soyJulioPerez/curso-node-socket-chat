const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } =require('../middlewares');
const { obtenerCategorias, obtenerCategoria, crearCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { categoriaExiste } = require('../helpers/db-validators');

const router = Router();

router.get('/', obtenerCategorias);

router.get('/:id', [
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom(categoriaExiste),
  validarCampos
], obtenerCategoria);

router.post('/', [
  validarJWT,
  check('nombre', 'El nombre de la categoría es requerido').not().isEmpty(),
  validarCampos
],crearCategoria);

router.put('/:id', [
  validarJWT,
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom(categoriaExiste),
  check('nombre', 'El nombre es requerido').not().isEmpty(),
  validarCampos
], actualizarCategoria);

router.delete('/:id', [
  validarJWT,
  check('id', 'No es in ID válido').isMongoId(),
  check('id').custom(categoriaExiste),
  esAdminRole,
  validarCampos
], borrarCategoria);

module.exports = router;