const { Schema, model } = require('mongoose');

/**
 ** Definición del Schema
 ** Definición de cada uno de los registros dentro de una colección/tabla.
 *! Alerta
 */
const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    default: 'USER_ROLE',
  },
  google: {
    type: Boolean,
    required: false,
  },
});

UsuarioSchema.method('toJSON', function () {
  const { _v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model('Usuario', UsuarioSchema);
