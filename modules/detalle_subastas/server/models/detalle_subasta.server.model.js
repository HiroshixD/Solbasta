'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Detalle_subasta Schema
 */
var Detalle_subastaSchema = new Schema({
  titulo: {
    type: String,
    trim: true,
    required: 'Especifíca un titulo válido por favor'
  },
  numberid: {
    type: Number
  },
  descripcion: {
    type: String,
    trim: true,
    required: 'Especifíca una descripcion válida por favor'
  },
  cant_pujas: {
    type: Number,
    default: 0
  },
  tipos: {
    rapidita: { type: Boolean, required: true, default: false },
    revancha: { type: Boolean, required: true, default: false },
    novato: { type: Boolean, required: true, default: false },
    estandar: { type: Boolean, required: true, default: false },
    cumpleanero: { type: Boolean, required: true, default: false },
    menosveinte: { type: Boolean, required: true, default: false }
  },
  fecha_inicio: {
    type: Date,
    required: 'Indica una fecha de inicio para ésta subasta'
  },
  fecha_fin: {
    type: Date,
    default: null
  },
  start: {
    type: Date,
    default: null
  },
  ultima_oferta: {
    type: Schema.ObjectId,
    ref: 'User',
    default: null
  },
  tiempo_restante: {
    type: Number,
    default: 0
  },
  min_pujas: {
    type: Number,
    default: 100000
  },
  max_pujas: {
    type: Number,
    default: 100000
  },
  shipping: {
    type: Boolean,
    default: true
  },
  destacado: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  precio_vendido: {
    type: Number,
    default: 0
  },
  estado: {
    type: Number,
    default: 2
  },
  estado_envio: {
    type: Number,
    default: 0
  },
  estado_pago: {
    type: Number,
    default: 0
  },
  remindered: {
    type: Boolean,
    default: false
  },
  winner: {
    type: Schema.ObjectId,
    ref: 'User',
    default: null
  },
  producto: {
    type: Schema.ObjectId,
    ref: 'Producto',
    required: 'Especifíca un producto a subastar'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Detalle_subasta', Detalle_subastaSchema);
