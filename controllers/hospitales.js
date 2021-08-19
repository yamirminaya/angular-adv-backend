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
    const hospitales = await Hospital.find().populate('usuario', 'nombre');
    res.json({ ok: true, hospitales, uid: req.uid });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Contacte con el administrador',
    });
  }
};

const actualizarHospital = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const hospitalDB = await Hospital.findById(uid);
    console.log(hospitalDB);
    if (!hospitalDB) {
      return res.status(400).json({
        ok: false,
        msg: 'No existe un hospital con el ID',
      });
    }

    const { nombre, usuario } = req.body;
    const hospitalActualizado = await Hospital.findByIdAndUpdate(
      uid,
      { nombre, usuario: req.uid },
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      msg: hospitalActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Contacte con el administrador. ',
    });
  }
};

const borrarHospital = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const hospitalDB = await Hospital.findById(uid);
    if (!hospitalDB) {
      return res.status(400).json({
        ok: false,
        msg: 'No existe un hospital con el ID.',
      });
    }

    const hospitalDelete = await Hospital.findOneAndDelete({ _id: uid });
    res.json({
      ok: true,
      hospital: hospitalDelete,
      msg: 'Hospital eliminado',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    });
  }

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
