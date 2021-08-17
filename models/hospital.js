const { Schema, model } = require('mongoose');

/**
 ** Definición del Schema
 ** Definición de cada uno de los registros dentro de una colección/tabla.
 *! Alerta
 */
const HospitalSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    // Indica a MONGOOSE que tendrá una referencia al SCHEMA USUARIO
    usuario: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
    },
  },
  { collection: 'hospitales' }
);

HospitalSchema.method('toJSON', function () {
  const { _v, ...object } = this.toObject();
  return object;
});

module.exports = model('Hospital', HospitalSchema);
