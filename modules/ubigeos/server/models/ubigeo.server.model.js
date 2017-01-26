'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Ubigeo Schema
 */
var UbigeoSchema = new Schema({
  idubigeo: {
    type: String
  },
  departamento: {
    type: String,
    trim: true
  },
  provincia: {
    type: String,
    trim: true
  },
  distrito: {
    type: String,
    trim: true
  }
});

mongoose.model('Ubigeo', UbigeoSchema);
