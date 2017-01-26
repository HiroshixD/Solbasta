'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Paquete Schema
 */
var PaqueteSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  nombre: {
    type: String,
    trim: true,
    required: 'Ingresa un nombre válido para el paquete'
  },
  valor: {
    type: Number,
    required: 'Es necesario ingresar la cantidad de soles por paquete'
  },
  monto: {
    type: Number,
    required: 'Ingresa el precio en Nuevos Soles: PEN'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Paquete', PaqueteSchema);
