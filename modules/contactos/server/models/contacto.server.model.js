'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Contacto Schema
 */
 // nombres, username, email, tema, asunto, mensaje, estado, respuesta
var ContactoSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  nombres: {
    type: String,
    trim: true,
    required: 'OLVIDASTE INGRESAR TUS NOMBRES'
  },
  username: {
    type: String,
    trim: true,
    required: 'OLVIDASTE INGRESAR TU NOMBRE DE USUARIO'
  },
  email: {
    type: String,
    trim: true,
    required: 'INGRESA TU EMAIL O VERIFICA QUE ESTÉ CORRECTAMENTE ESCRITO'
  },
  tema: {
    type: String,
    trim: true,
    required: 'OLVIDASTE INGRESAR UN TEMA DE DISCUSIÓN'
  },
  asunto: {
    type: String,
    trim: true,
    required: 'CUAL ES TU ASUNTO?'
  },
  mensaje: {
    type: String,
    trim: true,
    required: 'OLVIDARTE ESCRIBIR UN MENSAJE PARA NOSOTROS'
  },
  respuesta: {
    type: String,
    trim: true,
    default: ''
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

mongoose.model('Contacto', ContactoSchema);
