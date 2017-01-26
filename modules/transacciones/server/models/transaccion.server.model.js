'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Transaccion Schema
 */
var TransaccionSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  subasta: {
    type: Schema.ObjectId,
    ref: 'Detalle_subasta'
  },
  estado: {
    type: Number
  },
  saldo: {
    type: Number
  },
  transaccion_token: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Transaccion', TransaccionSchema);
