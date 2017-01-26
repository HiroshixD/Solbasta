
'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Categoria Schema
 */
var CategoriaSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  nombre: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  estado: {
    type: Number,
    default: 1,
    trim: true
  },
  imageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Categoria', CategoriaSchema);
