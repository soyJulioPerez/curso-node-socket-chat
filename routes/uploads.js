const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, recuperarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos, validarArchivo } = require('../middlewares')

const router = Router();

router.post('/', validarArchivo, cargarArchivo);

router.put('/:coleccion/:id', [
  check('id', 'No es un ID válido de Mongo').isMongoId(),
  check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos,
  validarArchivo,
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
  check('id', 'No es un ID válido de Mongo').isMongoId(),
  check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos,
], recuperarImagen);

module.exports = router;
