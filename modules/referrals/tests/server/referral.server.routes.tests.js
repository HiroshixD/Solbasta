'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Referral = mongoose.model('Referral'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  referral;

/**
 * Referral routes tests
 */
describe('Referral CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new referral
    user.save(function () {
      referral = {
        title: 'Referral Title',
        content: 'Referral Content'
      };

      done();
    });
  });

  it('should be able to save an referral if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new referral
        agent.post('/api/referrals')
          .send(referral)
          .expect(200)
          .end(function (referralSaveErr, referralSaveRes) {
            // Handle referral save error
            if (referralSaveErr) {
              return done(referralSaveErr);
            }

            // Get a list of referrals
            agent.get('/api/referrals')
              .end(function (referralsGetErr, referralsGetRes) {
                // Handle referral save error
                if (referralsGetErr) {
                  return done(referralsGetErr);
                }

                // Get referrals list
                var referrals = referralsGetRes.body;

                // Set assertions
                (referrals[0].user._id).should.equal(userId);
                (referrals[0].title).should.match('Referral Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an referral if not logged in', function (done) {
    agent.post('/api/referrals')
      .send(referral)
      .expect(403)
      .end(function (referralSaveErr, referralSaveRes) {
        // Call the assertion callback
        done(referralSaveErr);
      });
  });

  it('should not be able to save an referral if no title is provided', function (done) {
    // Invalidate title field
    referral.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new referral
        agent.post('/api/referrals')
          .send(referral)
          .expect(400)
          .end(function (referralSaveErr, referralSaveRes) {
            // Set message assertion
            (referralSaveRes.body.message).should.match('Title cannot be blank');

            // Handle referral save error
            done(referralSaveErr);
          });
      });
  });

  it('should be able to update an referral if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new referral
        agent.post('/api/referrals')
          .send(referral)
          .expect(200)
          .end(function (referralSaveErr, referralSaveRes) {
            // Handle referral save error
            if (referralSaveErr) {
              return done(referralSaveErr);
            }

            // Update referral title
            referral.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing referral
            agent.put('/api/referrals/' + referralSaveRes.body._id)
              .send(referral)
              .expect(200)
              .end(function (referralUpdateErr, referralUpdateRes) {
                // Handle referral update error
                if (referralUpdateErr) {
                  return done(referralUpdateErr);
                }

                // Set assertions
                (referralUpdateRes.body._id).should.equal(referralSaveRes.body._id);
                (referralUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of referrals if not signed in', function (done) {
    // Create new referral model instance
    var referralObj = new Referral(referral);

    // Save the referral
    referralObj.save(function () {
      // Request referrals
      request(app).get('/api/referrals')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single referral if not signed in', function (done) {
    // Create new referral model instance
    var referralObj = new Referral(referral);

    // Save the referral
    referralObj.save(function () {
      request(app).get('/api/referrals/' + referralObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', referral.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single referral with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/referrals/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Referral is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single referral which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent referral
    request(app).get('/api/referrals/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No referral with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an referral if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new referral
        agent.post('/api/referrals')
          .send(referral)
          .expect(200)
          .end(function (referralSaveErr, referralSaveRes) {
            // Handle referral save error
            if (referralSaveErr) {
              return done(referralSaveErr);
            }

            // Delete an existing referral
            agent.delete('/api/referrals/' + referralSaveRes.body._id)
              .send(referral)
              .expect(200)
              .end(function (referralDeleteErr, referralDeleteRes) {
                // Handle referral error error
                if (referralDeleteErr) {
                  return done(referralDeleteErr);
                }

                // Set assertions
                (referralDeleteRes.body._id).should.equal(referralSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an referral if not signed in', function (done) {
    // Set referral user
    referral.user = user;

    // Create new referral model instance
    var referralObj = new Referral(referral);

    // Save the referral
    referralObj.save(function () {
      // Try deleting referral
      request(app).delete('/api/referrals/' + referralObj._id)
        .expect(403)
        .end(function (referralDeleteErr, referralDeleteRes) {
          // Set message assertion
          (referralDeleteRes.body.message).should.match('User is not authorized');

          // Handle referral error error
          done(referralDeleteErr);
        });

    });
  });

  it('should be able to get a single referral that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new referral
          agent.post('/api/referrals')
            .send(referral)
            .expect(200)
            .end(function (referralSaveErr, referralSaveRes) {
              // Handle referral save error
              if (referralSaveErr) {
                return done(referralSaveErr);
              }

              // Set assertions on new referral
              (referralSaveRes.body.title).should.equal(referral.title);
              should.exist(referralSaveRes.body.user);
              should.equal(referralSaveRes.body.user._id, orphanId);

              // force the referral to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the referral
                    agent.get('/api/referrals/' + referralSaveRes.body._id)
                      .expect(200)
                      .end(function (referralInfoErr, referralInfoRes) {
                        // Handle referral error
                        if (referralInfoErr) {
                          return done(referralInfoErr);
                        }

                        // Set assertions
                        (referralInfoRes.body._id).should.equal(referralSaveRes.body._id);
                        (referralInfoRes.body.title).should.equal(referral.title);
                        should.equal(referralInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single referral if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new referral model instance
    referral.user = user;
    var referralObj = new Referral(referral);

    // Save the referral
    referralObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Save a new referral
          agent.post('/api/referrals')
            .send(referral)
            .expect(200)
            .end(function (referralSaveErr, referralSaveRes) {
              // Handle referral save error
              if (referralSaveErr) {
                return done(referralSaveErr);
              }

              // Get the referral
              agent.get('/api/referrals/' + referralSaveRes.body._id)
                .expect(200)
                .end(function (referralInfoErr, referralInfoRes) {
                  // Handle referral error
                  if (referralInfoErr) {
                    return done(referralInfoErr);
                  }

                  // Set assertions
                  (referralInfoRes.body._id).should.equal(referralSaveRes.body._id);
                  (referralInfoRes.body.title).should.equal(referral.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (referralInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single referral if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new referral model instance
    var referralObj = new Referral(referral);

    // Save the referral
    referralObj.save(function () {
      request(app).get('/api/referrals/' + referralObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', referral.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single referral, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Referral
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new referral
          agent.post('/api/referrals')
            .send(referral)
            .expect(200)
            .end(function (referralSaveErr, referralSaveRes) {
              // Handle referral save error
              if (referralSaveErr) {
                return done(referralSaveErr);
              }

              // Set assertions on new referral
              (referralSaveRes.body.title).should.equal(referral.title);
              should.exist(referralSaveRes.body.user);
              should.equal(referralSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the referral
                  agent.get('/api/referrals/' + referralSaveRes.body._id)
                    .expect(200)
                    .end(function (referralInfoErr, referralInfoRes) {
                      // Handle referral error
                      if (referralInfoErr) {
                        return done(referralInfoErr);
                      }

                      // Set assertions
                      (referralInfoRes.body._id).should.equal(referralSaveRes.body._id);
                      (referralInfoRes.body.title).should.equal(referral.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (referralInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Referral.remove().exec(done);
    });
  });
});
