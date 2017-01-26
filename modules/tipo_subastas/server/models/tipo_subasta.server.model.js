'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tipo_subasta Schema
 */
var Tipo_subastaSchema = new Schema({
  nombre: {
    type: String,
    required: 'El nombre es obligatorio',
    trim: true
  },
  estado: {
    type: Number,
    required: 'Parece que te olvidaste poner el estado de este tipo de subasta'
  },
  icono: {
    type: String,
    default: ''
  },
  descripcion: {
    type: String,
    required: 'Por favor, necesitamos una breve descripcion de esta subasta',
    trim: true
  },
  nro_tipo: {
    type: Number
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Tipo_subasta', Tipo_subastaSchema);
