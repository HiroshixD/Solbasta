'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Transaccion_cuenta = mongoose.model('Transaccion_cuenta');

/**
 * Globals
 */
var user,
  transaccion_cuenta;

/**
 * Unit tests
 */
describe('Transaccion_cuenta Model Unit Tests:', function () {

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
      transaccion_cuenta = new Transaccion_cuenta({
        title: 'Transaccion_cuenta Title',
        content: 'Transaccion_cuenta Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return transaccion_cuenta.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      transaccion_cuenta.title = '';

      return transaccion_cuenta.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Transaccion_cuenta.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
