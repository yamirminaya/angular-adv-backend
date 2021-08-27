const { response } = require('express');
// const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { compare } = require('../helpers/handleBcrypt');
const { getMenuFrontend } = require('../helpers/menu-frontend');

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
    // const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    const validPassword = await compare(password, usuarioDB.password);
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
      menu: getMenuFrontend(usuarioDB.role),
    });
  } catch (error) {}
};

const googleSignIn = async (req, res = response) => {
  const googleToken = req.body.token;
  try {
    const { name, email, picture } = await googleVerify(googleToken);

    const usuarioDB = await Usuario.findOne({ email });

    let usuario;
    if (!usuarioDB) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: '@@@',
        img: picture,
        google: true,
      });
    } else {
      // existe usuario
      usuario = usuarioDB;
      usuario.google = true;
      usuario.img = picture;
    }

    // Guardar en DB
    await usuario.save();

    // Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({ ok: true, token, menu: getMenuFrontend(usuario.role) });
  } catch (error) {
    res.status(401).json({ ok: true, msg: 'Token no es correcto.' });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  // Generar el TOKEN - JWT
  const token = await generarJWT(uid);

  // Obtener el usuario por UID
  const usuario = await Usuario.findById(uid);

  res.json({
    ok: true,
    token,
    usuario,
    menu: getMenuFrontend(usuario.role),
  });
};

const g = async (req, res = response) => {
  console.log('hola');
  console.log(req);
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
  g,
};
