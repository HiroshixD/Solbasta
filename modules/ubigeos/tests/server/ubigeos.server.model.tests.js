'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ubigeo = mongoose.model('Ubigeo');

/**
 * Globals
 */
var user,
  ubigeo;

/**
 * Unit tests
 */
describe('Ubigeo Model Unit Tests:', function () {

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
      ubigeo = new Ubigeo({
        title: 'Ubigeo Title',
        content: 'Ubigeo Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return ubigeo.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      ubigeo.title = '';

      return ubigeo.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Ubigeo.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
