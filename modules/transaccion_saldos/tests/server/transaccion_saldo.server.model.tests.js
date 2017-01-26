'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Transaccion_saldo = mongoose.model('Transaccion_saldo');

/**
 * Globals
 */
var user,
  transaccion_saldo;

/**
 * Unit tests
 */
describe('Transaccion_saldo Model Unit Tests:', function () {

  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function () {
      transaccion_saldo = new Transaccion_saldo({
        title: 'Transaccion_saldo Title',
        content: 'Transaccion_saldo Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return transaccion_saldo.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      transaccion_saldo.title = '';

      return transaccion_saldo.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Transaccion_saldo.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
