//* Ruta: /api/login
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { login, googleSignIn, renewToken, g } = require('../controllers/auth');

const router = Router();

router.post(
  '/',
  [
    check('email', 'El correo es obligatorio.').isEmail(),
    check('password', 'La contraseña es obligatoria.').not().isEmpty(),
    validarCampos,
  ],
  login
);

router.post(
  '/google',
  [
    check('token', 'El token de Google es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  googleSignIn
);

router.get('/renew', validarJWT, renewToken);

router.post('/g', g);

module.exports = router;
