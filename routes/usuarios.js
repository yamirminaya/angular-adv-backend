//* Ruta: /api/usuarios
const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

const {
  getUsuarios,
  crearUsuario,
  updateUsuario,
  borrarUsuario,
} = require('../controllers/usuarios');

const router = Router();

router.get('/', validarJWT, getUsuarios);
router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    check('email', 'El correo es obligatorio.').isEmail(),
    check('password', 'La contraseña es obligatoria.').not().isEmpty(),
    validarCampos,
  ],
  crearUsuario
);
router.put(
  '/:id',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    check('email', 'El correo es obligatorio.').isEmail(),
    check('role', 'El rol es obligatorio.').not().isEmpty(),
    validarCampos,
  ],
  updateUsuario
);
router.delete('/:id', validarJWT, borrarUsuario);

module.exports = router;
