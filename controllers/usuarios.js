const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  //* V1: Código NO EFICIENTE
  //* Problema UNO
  //? 2 procesos son lanzados de manera sincrónca
  //? No se ejecutan de manera simultánea
  // const usuarios = await Usuario.find({}, 'nombre email role google')
  //   .skip(desde)
  //   .limit(5);
  // const total = await Usuario.count();

  //* V2: Código EFICIENTE
  //* Solución
  //? Se ejecutan de manera simultanea y esperan que AMBOS procesos terminen
  const [usuarios, total] = await Promise.all([
    Usuario.find({}, 'nombre email role google img').skip(desde).limit(5),
    Usuario.countDocuments(),
  ]);

  res.json({ ok: true, usuarios, total });
};

const crearUsuario = async (req, res = response) => {
  const { nombre, email, password } = req.body;
  // const errores = validationResult(req);
  // if (!errores.isEmpty()) {
  //   return res.status(400).json({ ok: false, errors: errores.mapped() });
  // }
  try {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res
        .status(400)
        .json({ ok: false, msg: 'El correo ya está registrado' });
    }

    const usuario = new Usuario(req.body);

    //* Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //* Guardar usuario
    await usuario.save();

    //* Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({ ok: true, usuario, token });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs',
    });
  }
};

const updateUsuario = async (req, res = response) => {
  // TODO: Validar TOKEN y comprobar si es el usuario correcto

  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        msg: 'No existe un usuario con el ID.',
      });
    }

    //* Actualizaciones
    const { password, google, email, ...campos } = req.body;
    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: `Ya existe usuario con el email "${email}"`,
        });
      }
    }
    // delete campos.password;
    // delete campos.google;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });
    console.log(usuarioActualizado);

    res.json({
      ok: true,
      msg: usuarioActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    });
  }
};

const borrarUsuario = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        msg: 'No existe un usuario con el ID.',
      });
    }

    await Usuario.findOneAndDelete(uid);
    res.json({
      ok: true,
      msg: 'Usuario eliminado',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  updateUsuario,
  borrarUsuario,
};
