'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Compartido Schema
 */
var CompartidoSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  red_social: {
    type: Number
  },
  tipo: {
    type: Number
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Compartido', CompartidoSchema);
