const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = async (req, res = response) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  // Validar TIPO
  const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: 'Tipo no soportado',
    });
  }

  // Validar que exista un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: 'No files were uploaded.',
    });
  }

  // Procesar la imagen
  const file = req.files.imagen;
  const nombreCortado = file.name.split('.');
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // Extensiones válidas
  const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      msg: 'Formato de archivo NO VÁLIDO',
    });
  }

  // Generar nombre de archivo
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

  // Path para guardar la imagen
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  // Use the mv() method to place the file somewhere on your server
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: 'No se pudo mover el archivo',
      });
    }

    // Actualizar la BD
    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
      ok: true,
      msg: 'Archivo subido',
      nombreArchivo,
    });
  });
};

module.exports = {
  fileUpload,
};
