/*
    Hospitales
    ruta: /api/hospitales
*/

//* Ruta: /api/usuarios
const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

const {
  crearHospital,
  getHospitales,
  actualizarHospital,
  borrarHospital,
} = require('../controllers/hospitales');

const router = Router();

router.get('/', getHospitales);
router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
    validarCampos,
  ],
  crearHospital
);
router.put('/:id', [], actualizarHospital);
router.delete('/:id', borrarHospital);

module.exports = router;