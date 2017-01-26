'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Evento = mongoose.model('Evento'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  evento;

/**
 * Evento routes tests
 */
describe('Evento CRUD tests', function () {

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

    // Save a user to the test db and create new evento
    user.save(function () {
      evento = {
        title: 'Evento Title',
        content: 'Evento Content'
      };

      done();
    });
  });

  it('should be able to save an evento if logged in', function (done) {
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

        // Save a new evento
        agent.post('/api/eventos')
          .send(evento)
          .expect(200)
          .end(function (eventoSaveErr, eventoSaveRes) {
            // Handle evento save error
            if (eventoSaveErr) {
              return done(eventoSaveErr);
            }

            // Get a list of eventos
            agent.get('/api/eventos')
              .end(function (eventosGetErr, eventosGetRes) {
                // Handle evento save error
                if (eventosGetErr) {
                  return done(eventosGetErr);
                }

                // Get eventos list
                var eventos = eventosGetRes.body;

                // Set assertions
                (eventos[0].user._id).should.equal(userId);
                (eventos[0].title).should.match('Evento Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an evento if not logged in', function (done) {
    agent.post('/api/eventos')
      .send(evento)
      .expect(403)
      .end(function (eventoSaveErr, eventoSaveRes) {
        // Call the assertion callback
        done(eventoSaveErr);
      });
  });

  it('should not be able to save an evento if no title is provided', function (done) {
    // Invalidate title field
    evento.title = '';

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

        // Save a new evento
        agent.post('/api/eventos')
          .send(evento)
          .expect(400)
          .end(function (eventoSaveErr, eventoSaveRes) {
            // Set message assertion
            (eventoSaveRes.body.message).should.match('Title cannot be blank');

            // Handle evento save error
            done(eventoSaveErr);
          });
      });
  });

  it('should be able to update an evento if signed in', function (done) {
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

        // Save a new evento
        agent.post('/api/eventos')
          .send(evento)
          .expect(200)
          .end(function (eventoSaveErr, eventoSaveRes) {
            // Handle evento save error
            if (eventoSaveErr) {
              return done(eventoSaveErr);
            }

            // Update evento title
            evento.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing evento
            agent.put('/api/eventos/' + eventoSaveRes.body._id)
              .send(evento)
              .expect(200)
              .end(function (eventoUpdateErr, eventoUpdateRes) {
                // Handle evento update error
                if (eventoUpdateErr) {
                  return done(eventoUpdateErr);
                }

                // Set assertions
                (eventoUpdateRes.body._id).should.equal(eventoSaveRes.body._id);
                (eventoUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of eventos if not signed in', function (done) {
    // Create new evento model instance
    var eventoObj = new Evento(evento);

    // Save the evento
    eventoObj.save(function () {
      // Request eventos
      request(app).get('/api/eventos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single evento if not signed in', function (done) {
    // Create new evento model instance
    var eventoObj = new Evento(evento);

    // Save the evento
    eventoObj.save(function () {
      request(app).get('/api/eventos/' + eventoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', evento.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single evento with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/eventos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Evento is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single evento which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent evento
    request(app).get('/api/eventos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No evento with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an evento if signed in', function (done) {
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

        // Save a new evento
        agent.post('/api/eventos')
          .send(evento)
          .expect(200)
          .end(function (eventoSaveErr, eventoSaveRes) {
            // Handle evento save error
            if (eventoSaveErr) {
              return done(eventoSaveErr);
            }

            // Delete an existing evento
            agent.delete('/api/eventos/' + eventoSaveRes.body._id)
              .send(evento)
              .expect(200)
              .end(function (eventoDeleteErr, eventoDeleteRes) {
                // Handle evento error error
                if (eventoDeleteErr) {
                  return done(eventoDeleteErr);
                }

                // Set assertions
                (eventoDeleteRes.body._id).should.equal(eventoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an evento if not signed in', function (done) {
    // Set evento user
    evento.user = user;

    // Create new evento model instance
    var eventoObj = new Evento(evento);

    // Save the evento
    eventoObj.save(function () {
      // Try deleting evento
      request(app).delete('/api/eventos/' + eventoObj._id)
        .expect(403)
        .end(function (eventoDeleteErr, eventoDeleteRes) {
          // Set message assertion
          (eventoDeleteRes.body.message).should.match('User is not authorized');

          // Handle evento error error
          done(eventoDeleteErr);
        });

    });
  });

  it('should be able to get a single evento that has an orphaned user reference', function (done) {
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

          // Save a new evento
          agent.post('/api/eventos')
            .send(evento)
            .expect(200)
            .end(function (eventoSaveErr, eventoSaveRes) {
              // Handle evento save error
              if (eventoSaveErr) {
                return done(eventoSaveErr);
              }

              // Set assertions on new evento
              (eventoSaveRes.body.title).should.equal(evento.title);
              should.exist(eventoSaveRes.body.user);
              should.equal(eventoSaveRes.body.user._id, orphanId);

              // force the evento to have an orphaned user reference
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

                    // Get the evento
                    agent.get('/api/eventos/' + eventoSaveRes.body._id)
                      .expect(200)
                      .end(function (eventoInfoErr, eventoInfoRes) {
                        // Handle evento error
                        if (eventoInfoErr) {
                          return done(eventoInfoErr);
                        }

                        // Set assertions
                        (eventoInfoRes.body._id).should.equal(eventoSaveRes.body._id);
                        (eventoInfoRes.body.title).should.equal(evento.title);
                        should.equal(eventoInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single evento if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new evento model instance
    evento.user = user;
    var eventoObj = new Evento(evento);

    // Save the evento
    eventoObj.save(function () {
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

          // Save a new evento
          agent.post('/api/eventos')
            .send(evento)
            .expect(200)
            .end(function (eventoSaveErr, eventoSaveRes) {
              // Handle evento save error
              if (eventoSaveErr) {
                return done(eventoSaveErr);
              }

              // Get the evento
              agent.get('/api/eventos/' + eventoSaveRes.body._id)
                .expect(200)
                .end(function (eventoInfoErr, eventoInfoRes) {
                  // Handle evento error
                  if (eventoInfoErr) {
                    return done(eventoInfoErr);
                  }

                  // Set assertions
                  (eventoInfoRes.body._id).should.equal(eventoSaveRes.body._id);
                  (eventoInfoRes.body.title).should.equal(evento.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (eventoInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single evento if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new evento model instance
    var eventoObj = new Evento(evento);

    // Save the evento
    eventoObj.save(function () {
      request(app).get('/api/eventos/' + eventoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', evento.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single evento, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Evento
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

          // Save a new evento
          agent.post('/api/eventos')
            .send(evento)
            .expect(200)
            .end(function (eventoSaveErr, eventoSaveRes) {
              // Handle evento save error
              if (eventoSaveErr) {
                return done(eventoSaveErr);
              }

              // Set assertions on new evento
              (eventoSaveRes.body.title).should.equal(evento.title);
              should.exist(eventoSaveRes.body.user);
              should.equal(eventoSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the evento
                  agent.get('/api/eventos/' + eventoSaveRes.body._id)
                    .expect(200)
                    .end(function (eventoInfoErr, eventoInfoRes) {
                      // Handle evento error
                      if (eventoInfoErr) {
                        return done(eventoInfoErr);
                      }

                      // Set assertions
                      (eventoInfoRes.body._id).should.equal(eventoSaveRes.body._id);
                      (eventoInfoRes.body.title).should.equal(evento.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (eventoInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Evento.remove().exec(done);
    });
  });
});
