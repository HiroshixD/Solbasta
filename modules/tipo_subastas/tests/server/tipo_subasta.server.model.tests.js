'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tipo_subasta = mongoose.model('Tipo_subasta');

/**
 * Globals
 */
var user,
  tipo_subasta;

/**
 * Unit tests
 */
describe('Tipo_subasta Model Unit Tests:', function () {

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
      tipo_subasta = new Tipo_subasta({
        title: 'Tipo_subasta Title',
        content: 'Tipo_subasta Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return tipo_subasta.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      tipo_subasta.title = '';

      return tipo_subasta.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Tipo_subasta.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
