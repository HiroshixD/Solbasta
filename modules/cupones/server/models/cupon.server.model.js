'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cupone Schema
 */
var CuponSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  soles: {
    type: Number,
    required: 'Soles de premio es un dato requerido'
  },
  fecha_inicio: {
    type: Date,
    default: Date.now,
    required: false
  },
  fecha_fin: {
    type: Date,
    default: Date.now,
    required: false
  },
  codigo: {
    type: String,
    unique: 'Este código ya fue creado anteriormente, genera otro código por favor',
    required: 'Por favor presiona el botón y genera un código válido',
    trim: true
  },
  estado: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Cupon', CuponSchema);
