'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Datos_envio = mongoose.model('Datos_envio');

/**
 * Globals
 */
var user,
  datos_envio;

/**
 * Unit tests
 */
describe('Datos_envio Model Unit Tests:', function () {

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
      datos_envio = new Datos_envio({
        title: 'Datos_envio Title',
        content: 'Datos_envio Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return datos_envio.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      datos_envio.title = '';

      return datos_envio.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Datos_envio.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
