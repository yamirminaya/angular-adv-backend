const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const usuarioDB = await Usuario.findOne({ email });

    //* Verificar email
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        msg: 'Email no encontrado',
      });
    }

    //* Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Contraseña no válida',
      });
    }

    //* Generar JWT
    const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {}
};

module.exports = {
  login,
};
