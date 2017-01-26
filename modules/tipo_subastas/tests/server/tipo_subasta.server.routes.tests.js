'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tipo_subasta = mongoose.model('Tipo_subasta'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  tipo_subasta;

/**
 * Tipo_subasta routes tests
 */
describe('Tipo_subasta CRUD tests', function () {

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

    // Save a user to the test db and create new tipo_subasta
    user.save(function () {
      tipo_subasta = {
        title: 'Tipo_subasta Title',
        content: 'Tipo_subasta Content'
      };

      done();
    });
  });

  it('should be able to save an tipo_subasta if logged in', function (done) {
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

        // Save a new tipo_subasta
        agent.post('/api/tipo_subastas')
          .send(tipo_subasta)
          .expect(200)
          .end(function (tipo_subastaSaveErr, tipo_subastaSaveRes) {
            // Handle tipo_subasta save error
            if (tipo_subastaSaveErr) {
              return done(tipo_subastaSaveErr);
            }

            // Get a list of tipo_subastas
            agent.get('/api/tipo_subastas')
              .end(function (tipo_subastasGetErr, tipo_subastasGetRes) {
                // Handle tipo_subasta save error
                if (tipo_subastasGetErr) {
                  return done(tipo_subastasGetErr);
                }

                // Get tipo_subastas list
                var tipo_subastas = tipo_subastasGetRes.body;

                // Set assertions
                (tipo_subastas[0].user._id).should.equal(userId);
                (tipo_subastas[0].title).should.match('Tipo_subasta Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an tipo_subasta if not logged in', function (done) {
    agent.post('/api/tipo_subastas')
      .send(tipo_subasta)
      .expect(403)
      .end(function (tipo_subastaSaveErr, tipo_subastaSaveRes) {
        // Call the assertion callback
        done(tipo_subastaSaveErr);
      });
  });

  it('should not be able to save an tipo_subasta if no title is provided', function (done) {
    // Invalidate title field
    tipo_subasta.title = '';

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

        // Save a new tipo_subasta
        agent.post('/api/tipo_subastas')
          .send(tipo_subasta)
          .expect(400)
          .end(function (tipo_subastaSaveErr, tipo_subastaSaveRes) {
            // Set message assertion
            (tipo_subastaSaveRes.body.message).should.match('Title cannot be blank');

            // Handle tipo_subasta save error
            done(tipo_subastaSaveErr);
          });
      });
  });

  it('should be able to update an tipo_subasta if signed in', function (done) {
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

        // Save a new tipo_subasta
        agent.post('/api/tipo_subastas')
          .send(tipo_subasta)
          .expect(200)
          .end(function (tipo_subastaSaveErr, tipo_subastaSaveRes) {
            // Handle tipo_subasta save error
            if (tipo_subastaSaveErr) {
              return done(tipo_subastaSaveErr);
            }

            // Update tipo_subasta title
            tipo_subasta.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing tipo_subasta
            agent.put('/api/tipo_subastas/' + tipo_subastaSaveRes.body._id)
              .send(tipo_subasta)
              .expect(200)
              .end(function (tipo_subastaUpdateErr, tipo_subastaUpdateRes) {
                // Handle tipo_subasta update error
                if (tipo_subastaUpdateErr) {
                  return done(tipo_subastaUpdateErr);
                }

                // Set assertions
                (tipo_subastaUpdateRes.body._id).should.equal(tipo_subastaSaveRes.body._id);
                (tipo_subastaUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of tipo_subastas if not signed in', function (done) {
    // Create new tipo_subasta model instance
    var tipo_subastaObj = new Tipo_subasta(tipo_subasta);

    // Save the tipo_subasta
    tipo_subastaObj.save(function () {
      // Request tipo_subastas
      request(app).get('/api/tipo_subastas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single tipo_subasta if not signed in', function (done) {
    // Create new tipo_subasta model instance
    var tipo_subastaObj = new Tipo_subasta(tipo_subasta);

    // Save the tipo_subasta
    tipo_subastaObj.save(function () {
      request(app).get('/api/tipo_subastas/' + tipo_subastaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', tipo_subasta.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single tipo_subasta with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tipo_subastas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Tipo_subasta is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single tipo_subasta which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent tipo_subasta
    request(app).get('/api/tipo_subastas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No tipo_subasta with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an tipo_subasta if signed in', function (done) {
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

        // Save a new tipo_subasta
        agent.post('/api/tipo_subastas')
          .send(tipo_subasta)
          .expect(200)
          .end(function (tipo_subastaSaveErr, tipo_subastaSaveRes) {
            // Handle tipo_subasta save error
            if (tipo_subastaSaveErr) {
              return done(tipo_subastaSaveErr);
            }

            // Delete an existing tipo_subasta
            agent.delete('/api/tipo_subastas/' + tipo_subastaSaveRes.body._id)
              .send(tipo_subasta)
              .expect(200)
              .end(function (tipo_subastaDeleteErr, tipo_subastaDeleteRes) {
                // Handle tipo_subasta error error
                if (tipo_subastaDeleteErr) {
                  return done(tipo_subastaDeleteErr);
                }

                // Set assertions
                (tipo_subastaDeleteRes.body._id).should.equal(tipo_subastaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an tipo_subasta if not signed in', function (done) {
    // Set tipo_subasta user
    tipo_subasta.user = user;

    // Create new tipo_subasta model instance
    var tipo_subastaObj = new Tipo_subasta(tipo_subasta);

    // Save the tipo_subasta
    tipo_subastaObj.save(function () {
      // Try deleting tipo_subasta
      request(app).delete('/api/tipo_subastas/' + tipo_subastaObj._id)
        .expect(403)
        .end(function (tipo_subastaDeleteErr, tipo_subastaDeleteRes) {
          // Set message assertion
          (tipo_subastaDeleteRes.body.message).should.match('User is not authorized');

          // Handle tipo_subasta error error
          done(tipo_subastaDeleteErr);
        });

    });
  });

  it('should be able to get a single tipo_subasta that has an orphaned user reference', function (done) {
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

          // Save a new tipo_subasta
          agent.post('/api/tipo_subastas')
            .send(tipo_subasta)
            .expect(200)
            .end(function (tipo_subastaSaveErr, tipo_subastaSaveRes) {
              // Handle tipo_subasta save error
              if (tipo_subastaSaveErr) {
                return done(tipo_subastaSaveErr);
              }

              // Set assertions on new tipo_subasta
              (tipo_subastaSaveRes.body.title).should.equal(tipo_subasta.title);
              should.exist(tipo_subastaSaveRes.body.user);
              should.equal(tipo_subastaSaveRes.body.user._id, orphanId);

              // force the tipo_subasta to have an orphaned user reference
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

                    // Get the tipo_subasta
                    agent.get('/api/tipo_subastas/' + tipo_subastaSaveRes.body._id)
                      .expect(200)
                      .end(function (tipo_subastaInfoErr, tipo_subastaInfoRes) {
                        // Handle tipo_subasta error
                        if (tipo_subastaInfoErr) {
                          return done(tipo_subastaInfoErr);
                        }

                        // Set assertions
                        (tipo_subastaInfoRes.body._id).should.equal(tipo_subastaSaveRes.body._id);
                        (tipo_subastaInfoRes.body.title).should.equal(tipo_subasta.title);
                        should.equal(tipo_subastaInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single tipo_subasta if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new tipo_subasta model instance
    tipo_subasta.user = user;
    var tipo_subastaObj = new Tipo_subasta(tipo_subasta);

    // Save the tipo_subasta
    tipo_subastaObj.save(function () {
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

          // Save a new tipo_subasta
          agent.post('/api/tipo_subastas')
            .send(tipo_subasta)
            .expect(200)
            .end(function (tipo_subastaSaveErr, tipo_subastaSaveRes) {
              // Handle tipo_subasta save error
              if (tipo_subastaSaveErr) {
                return done(tipo_subastaSaveErr);
              }

              // Get the tipo_subasta
              agent.get('/api/tipo_subastas/' + tipo_subastaSaveRes.body._id)
                .expect(200)
                .end(function (tipo_subastaInfoErr, tipo_subastaInfoRes) {
                  // Handle tipo_subasta error
                  if (tipo_subastaInfoErr) {
                    return done(tipo_subastaInfoErr);
                  }

                  // Set assertions
                  (tipo_subastaInfoRes.body._id).should.equal(tipo_subastaSaveRes.body._id);
                  (tipo_subastaInfoRes.body.title).should.equal(tipo_subasta.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (tipo_subastaInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single tipo_subasta if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new tipo_subasta model instance
    var tipo_subastaObj = new Tipo_subasta(tipo_subasta);

    // Save the tipo_subasta
    tipo_subastaObj.save(function () {
      request(app).get('/api/tipo_subastas/' + tipo_subastaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', tipo_subasta.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single tipo_subasta, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Tipo_subasta
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

          // Save a new tipo_subasta
          agent.post('/api/tipo_subastas')
            .send(tipo_subasta)
            .expect(200)
            .end(function (tipo_subastaSaveErr, tipo_subastaSaveRes) {
              // Handle tipo_subasta save error
              if (tipo_subastaSaveErr) {
                return done(tipo_subastaSaveErr);
              }

              // Set assertions on new tipo_subasta
              (tipo_subastaSaveRes.body.title).should.equal(tipo_subasta.title);
              should.exist(tipo_subastaSaveRes.body.user);
              should.equal(tipo_subastaSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the tipo_subasta
                  agent.get('/api/tipo_subastas/' + tipo_subastaSaveRes.body._id)
                    .expect(200)
                    .end(function (tipo_subastaInfoErr, tipo_subastaInfoRes) {
                      // Handle tipo_subasta error
                      if (tipo_subastaInfoErr) {
                        return done(tipo_subastaInfoErr);
                      }

                      // Set assertions
                      (tipo_subastaInfoRes.body._id).should.equal(tipo_subastaSaveRes.body._id);
                      (tipo_subastaInfoRes.body.title).should.equal(tipo_subasta.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (tipo_subastaInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Tipo_subasta.remove().exec(done);
    });
  });
});
