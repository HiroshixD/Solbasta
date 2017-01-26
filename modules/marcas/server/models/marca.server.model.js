'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Marca Schema
 */
var MarcaSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  nombre: {
    type: String,
    default: '',
    trim: true,
    required: 'El campo está vacio ..!'
  },
  estado: {
    type: Number,
    default: 1
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Marca', MarcaSchema);
