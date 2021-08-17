const { Schema, model } = require('mongoose');

/**
 ** Definición del Schema
 ** Definición de cada uno de los registros dentro de una colección/tabla.
 *! Alerta
 */
const MedicoSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  // Indica a MONGOOSE que tendrá una referencia al SCHEMA USUARIO
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
});

MedicoSchema.method('toJSON', function () {
  const { _v, ...object } = this.toObject();
  return object;
});

module.exports = model('Medico', MedicoSchema);
