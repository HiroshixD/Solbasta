'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Transaccion_cuenta Schema
 */
var Transaccion_cuentaSchema = new Schema({
  fecha_compra: {
    type: Date,
    default: Date.now
  },
  identificador: {
    type: String
  },
  monto: {
    type: Number
  },
  tipo_moneda: {
    type: String
  },
  cupon: {
    type: Schema.ObjectId,
    ref: 'Cupon'
  },
  tipo_pago: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  paquete: {
    type: Schema.ObjectId,
    ref: 'Paquete'
  },
  transaccion: {
    type: Schema.ObjectId,
    ref: 'Transaccion_saldo'
  }
});

mongoose.model('Transaccion_cuenta', Transaccion_cuentaSchema);
