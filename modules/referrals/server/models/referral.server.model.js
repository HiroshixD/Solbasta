'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Referral Schema
 */
var ReferralSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  referral: {
    type: String
  },
  bonus_status: {
    type: Boolean,
    default: false
  },
  referral_account_status: {
    type: Boolean,
    default: false
  },
  referral_nickname: {
    type: String
  },
  referral_fullname: {
    type: String
  }
});

mongoose.model('Referral', ReferralSchema);
