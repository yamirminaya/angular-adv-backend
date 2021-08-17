const { response } = require('express');
const Hospital = require('../models/hospital');

const crearHospital = async (req, res = response) => {
  const uid = req.uid;

  // Desestructurando
  const hospital = new Hospital({
    usuario: uid,
    ...req.body,
  });

  try {
    const hospitalDB = await hospital.save();

    res.json({
      ok: true,
      hospital: hospitalDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Contacte con el administrador',
    });
  }
};

const getHospitales = async (req, res = response) => {
  try {
    const hospitales = await Hospital.find().populate(
      'usuario',
      'nombre email img'
    );
    res.json({ ok: true, hospitales, uid: req.uid });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Contacte con el administrador',
    });
  }
};

const actualizarHospital = (req, res = response) => {
  res.json({
    ok: true,
    msg: 'actualizarHospital',
  });
};

const borrarHospital = (req, res = response) => {
  res.json({
    ok: true,
    msg: 'borrarHospital',
  });
};

module.exports = {
  crearHospital,
  getHospitales,
  actualizarHospital,
  borrarHospital,
};
