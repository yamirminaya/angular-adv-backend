const { response } = require('express');
const Medico = require('../models/medico');

const crearMedico = async (req, res = response) => {
  const uid = req.uid;
  // Desestructurando
  const medico = new Medico({
    usuario: uid,
    ...req.body,
  });

  try {
    const medicoDB = await medico.save();

    res.json({
      ok: true,
      medico: medicoDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Contacte con el administrador',
    });
  }
};

const getMedicos = async (req, res = response) => {
  try {
    // await Medico.find({}, 'nombre')
    const medicos = await Medico.find()
      .populate('usuario', 'nombre')
      .populate('hospital', 'nombre');
    res.json({
      ok: true,
      medicos,
      uid: req.uid,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Contacte con el administrador',
    });
  }
};

const actualizarMedico = (req, res = response) => {
  res.json({
    ok: true,
    msg: 'actualizarMedico',
  });
};

const borrarMedico = (req, res = response) => {
  res.json({
    ok: true,
    msg: 'borrarMedico',
  });
};

module.exports = {
  crearMedico,
  getMedicos,
  actualizarMedico,
  borrarMedico,
};
