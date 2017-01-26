'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Datos_envio Schema
 */
var Datos_envioSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  direccion_calle: {
    type: String,
    default: 'Mi direccion',
    trim: true
  },
  direccion_referencia: {
    type: String,
    default: '',
    trim: true
  },
  direccion_destinatario: {
    type: String,
    default: '',
    trim: true
  },
  direccion: {
    type: Schema.ObjectId,
    ref: 'Ubigeo',
    required: false
  },
  entrega_calle: {
    type: String,
    default: 'Direccion de referencia',
    trim: true
  },
  entrega_referencia: {
    type: String,
    default: '',
    trim: true
  },
  entrega_destinatario: {
    type: String,
    default: '',
    trim: true
  },
  entrega: {
    type: Schema.ObjectId,
    ref: 'Ubigeo',
    required: false
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Datos_envio', Datos_envioSchema);
