//* Ruta: /api/usuarios
const { Router } = require('express');
const { check } = require('express-validator');

const {
  validarJWT,
  validarADMIN_ROLE,
  validarADMIN_ROLE_o_MISMO_USUARIO,
} = require('../middlewares/validar-jwt');
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
    validarADMIN_ROLE_o_MISMO_USUARIO,
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    check('email', 'El correo es obligatorio.').isEmail(),
    check('role', 'El rol es obligatorio.').not().isEmpty(),
    validarCampos,
  ],
  updateUsuario
);
router.delete('/:id', [validarJWT, validarADMIN_ROLE], borrarUsuario);

module.exports = router;
