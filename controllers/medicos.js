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

const actualizarMedico = async (req, res = response) => {
  const uid = req.params.id;
  const usuario = req.uid;
  try {
    const medicoDB = await Medico.findById(uid);
    if (!medicoDB) {
      return res.status(400).json({
        ok: false,
        msg: 'No existe un médico con el ID.',
      });
    }

    const { nombre, hospital } = req.body;
    const medicoActualizado = await Medico.findByIdAndUpdate(
      uid,
      {
        nombre,
        hospital,
        usuario,
      },
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      msg: medicoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    });
  }
};

const borrarMedico = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const medicoDB = await Medico.findById(uid);
    if (!medicoDB) {
      return res.status(400).json({
        ok: false,
        msg: 'No existe un médico con el ID.',
      });
    }

    const medicoDelete = await Medico.findOneAndDelete({ _id: uid });

    res.json({
      ok: true,
      medico: medicoDelete,
      msg: 'borrarMedico',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    });
  }
};

module.exports = {
  crearMedico,
  getMedicos,
  actualizarMedico,
  borrarMedico,
};
