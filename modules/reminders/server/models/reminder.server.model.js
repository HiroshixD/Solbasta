'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Reminder Schema
 */
var ReminderSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Boolean,
    default: true
  },
  subasta: {
    type: Schema.ObjectId,
    ref: 'Detalle_subasta'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Reminder', ReminderSchema);
