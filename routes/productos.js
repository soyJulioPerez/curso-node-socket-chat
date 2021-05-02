const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, tieneRole } = require('../middlewares');

const { consultarProductos, consultarProducto, crearProducto,
        actualizarProducto, borrarProducto} = require('../controllers/productos');
const { categoriaExiste, productoExiste } = require('../helpers/db-validators');

        const router = Router();

router.get('/', consultarProductos);

router.get('/:id', [
  check('id', 'No es in ID válido').isMongoId(),
  check('id').custom(productoExiste),
  validarCampos
],consultarProducto);

router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es requerido').not().isEmpty(),
  check('categoria', 'La categoria es requerida').not().isEmpty(),
  check('categoria', 'Debe ser un ObjectId de mongo').isMongoId(),
  check('categoria').custom(categoriaExiste),
  validarCampos
], crearProducto);

router.put('/:id', [
  validarJWT,
  tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id', 'No es in ID válido').isMongoId(),
  check('id').custom(productoExiste),
  validarCampos
],actualizarProducto);

router.delete('/:id', [
  validarJWT,
  check('id', 'No es in ID válido').isMongoId(),
  check('id').custom(productoExiste),
  validarCampos
],borrarProducto);

module.exports = router;
