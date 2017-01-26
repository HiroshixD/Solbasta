'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Transaccion = mongoose.model('Transaccion');

/**
 * Globals
 */
var user,
  transaccion;

/**
 * Unit tests
 */
describe('Transaccion Model Unit Tests:', function () {

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
      transaccion = new Transaccion({
        title: 'Transaccion Title',
        content: 'Transaccion Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return transaccion.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      transaccion.title = '';

      return transaccion.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Transaccion.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
