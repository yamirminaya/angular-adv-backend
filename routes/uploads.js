/*
    Búsqueda
    Ruta: api/todo/:busqueda
*/

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');

const { fileUpload, retornaImagen } = require('../controllers/uploads');

const router = Router();
router.use(expressFileUpload());

router.get('/:tipo/:foto', retornaImagen);
router.put('/:tipo/:id', validarJWT, fileUpload);

module.exports = router;
