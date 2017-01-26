'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Evento Schema
 */
var EventoSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  descripcion: {
    type: String,
    default: '',
    trim: true,
    required: 'Escribe una descripción valida para tu nuevo evento'
  },
  fecha_inicio: {
    type: Date,
    required: 'Selecciona una fecha de inicio para tu nuevo evento'
  },
  fecha_fin: {
    type: Date,
    required: 'Selecciona una fecha de fin para tu nuevo evento'
  },
  premio: {
    type: Number,
    required: 'Ingresa en cantidad numérica el premio en soles (saldo) para éste evento'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Evento', EventoSchema);
