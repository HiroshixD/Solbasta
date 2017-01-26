'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Detalle_subasta = mongoose.model('Detalle_subasta');

/**
 * Globals
 */
var user,
  detalle_subasta;

/**
 * Unit tests
 */
describe('Detalle_subasta Model Unit Tests:', function () {

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
      detalle_subasta = new Detalle_subasta({
        title: 'Detalle_subasta Title',
        content: 'Detalle_subasta Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return detalle_subasta.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      detalle_subasta.title = '';

      return detalle_subasta.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Detalle_subasta.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
