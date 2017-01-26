'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Transaccion_saldo Schema
 */
var Transaccion_saldoSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  tipo_recarga: {
    type: String
  },
  soles_transferencia: {
    type: Number
  },
  transaccion_tipo: {
    type: String
  },
  estado: {
    type: Number
  },
  identificador: {
    type: String,
    default: null
  },
  //  Tipo -> Recarga : 0 ; Puja:1; Regalo: 2
  tipo: {
    type: Number
  },
  descripcion: {
    type: String,
    default: null
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  subasta: {
    type: Schema.ObjectId,
    ref: 'Detalle_subasta',
    default: null
  },
  idpaquete: {
    type: Schema.ObjectId,
    ref: 'Paquete',
    default: null
  }
});

mongoose.model('Transaccion_saldo', Transaccion_saldoSchema);
