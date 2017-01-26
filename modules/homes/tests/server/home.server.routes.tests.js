'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Home = mongoose.model('Home'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  home;

/**
 * Home routes tests
 */
describe('Home CRUD tests', function () {

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

    // Save a user to the test db and create new home
    user.save(function () {
      home = {
        title: 'Home Title',
        content: 'Home Content'
      };

      done();
    });
  });

  it('should be able to save an home if logged in', function (done) {
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

        // Save a new home
        agent.post('/api/homes')
          .send(home)
          .expect(200)
          .end(function (homeSaveErr, homeSaveRes) {
            // Handle home save error
            if (homeSaveErr) {
              return done(homeSaveErr);
            }

            // Get a list of homes
            agent.get('/api/homes')
              .end(function (homesGetErr, homesGetRes) {
                // Handle home save error
                if (homesGetErr) {
                  return done(homesGetErr);
                }

                // Get homes list
                var homes = homesGetRes.body;

                // Set assertions
                (homes[0].user._id).should.equal(userId);
                (homes[0].title).should.match('Home Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an home if not logged in', function (done) {
    agent.post('/api/homes')
      .send(home)
      .expect(403)
      .end(function (homeSaveErr, homeSaveRes) {
        // Call the assertion callback
        done(homeSaveErr);
      });
  });

  it('should not be able to save an home if no title is provided', function (done) {
    // Invalidate title field
    home.title = '';

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

        // Save a new home
        agent.post('/api/homes')
          .send(home)
          .expect(400)
          .end(function (homeSaveErr, homeSaveRes) {
            // Set message assertion
            (homeSaveRes.body.message).should.match('Title cannot be blank');

            // Handle home save error
            done(homeSaveErr);
          });
      });
  });

  it('should be able to update an home if signed in', function (done) {
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

        // Save a new home
        agent.post('/api/homes')
          .send(home)
          .expect(200)
          .end(function (homeSaveErr, homeSaveRes) {
            // Handle home save error
            if (homeSaveErr) {
              return done(homeSaveErr);
            }

            // Update home title
            home.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing home
            agent.put('/api/homes/' + homeSaveRes.body._id)
              .send(home)
              .expect(200)
              .end(function (homeUpdateErr, homeUpdateRes) {
                // Handle home update error
                if (homeUpdateErr) {
                  return done(homeUpdateErr);
                }

                // Set assertions
                (homeUpdateRes.body._id).should.equal(homeSaveRes.body._id);
                (homeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of homes if not signed in', function (done) {
    // Create new home model instance
    var homeObj = new Home(home);

    // Save the home
    homeObj.save(function () {
      // Request homes
      request(app).get('/api/homes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single home if not signed in', function (done) {
    // Create new home model instance
    var homeObj = new Home(home);

    // Save the home
    homeObj.save(function () {
      request(app).get('/api/homes/' + homeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', home.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single home with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/homes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Home is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single home which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent home
    request(app).get('/api/homes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No home with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an home if signed in', function (done) {
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

        // Save a new home
        agent.post('/api/homes')
          .send(home)
          .expect(200)
          .end(function (homeSaveErr, homeSaveRes) {
            // Handle home save error
            if (homeSaveErr) {
              return done(homeSaveErr);
            }

            // Delete an existing home
            agent.delete('/api/homes/' + homeSaveRes.body._id)
              .send(home)
              .expect(200)
              .end(function (homeDeleteErr, homeDeleteRes) {
                // Handle home error error
                if (homeDeleteErr) {
                  return done(homeDeleteErr);
                }

                // Set assertions
                (homeDeleteRes.body._id).should.equal(homeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an home if not signed in', function (done) {
    // Set home user
    home.user = user;

    // Create new home model instance
    var homeObj = new Home(home);

    // Save the home
    homeObj.save(function () {
      // Try deleting home
      request(app).delete('/api/homes/' + homeObj._id)
        .expect(403)
        .end(function (homeDeleteErr, homeDeleteRes) {
          // Set message assertion
          (homeDeleteRes.body.message).should.match('User is not authorized');

          // Handle home error error
          done(homeDeleteErr);
        });

    });
  });

  it('should be able to get a single home that has an orphaned user reference', function (done) {
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

          // Save a new home
          agent.post('/api/homes')
            .send(home)
            .expect(200)
            .end(function (homeSaveErr, homeSaveRes) {
              // Handle home save error
              if (homeSaveErr) {
                return done(homeSaveErr);
              }

              // Set assertions on new home
              (homeSaveRes.body.title).should.equal(home.title);
              should.exist(homeSaveRes.body.user);
              should.equal(homeSaveRes.body.user._id, orphanId);

              // force the home to have an orphaned user reference
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

                    // Get the home
                    agent.get('/api/homes/' + homeSaveRes.body._id)
                      .expect(200)
                      .end(function (homeInfoErr, homeInfoRes) {
                        // Handle home error
                        if (homeInfoErr) {
                          return done(homeInfoErr);
                        }

                        // Set assertions
                        (homeInfoRes.body._id).should.equal(homeSaveRes.body._id);
                        (homeInfoRes.body.title).should.equal(home.title);
                        should.equal(homeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single home if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new home model instance
    home.user = user;
    var homeObj = new Home(home);

    // Save the home
    homeObj.save(function () {
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

          // Save a new home
          agent.post('/api/homes')
            .send(home)
            .expect(200)
            .end(function (homeSaveErr, homeSaveRes) {
              // Handle home save error
              if (homeSaveErr) {
                return done(homeSaveErr);
              }

              // Get the home
              agent.get('/api/homes/' + homeSaveRes.body._id)
                .expect(200)
                .end(function (homeInfoErr, homeInfoRes) {
                  // Handle home error
                  if (homeInfoErr) {
                    return done(homeInfoErr);
                  }

                  // Set assertions
                  (homeInfoRes.body._id).should.equal(homeSaveRes.body._id);
                  (homeInfoRes.body.title).should.equal(home.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (homeInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single home if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new home model instance
    var homeObj = new Home(home);

    // Save the home
    homeObj.save(function () {
      request(app).get('/api/homes/' + homeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', home.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single home, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Home
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

          // Save a new home
          agent.post('/api/homes')
            .send(home)
            .expect(200)
            .end(function (homeSaveErr, homeSaveRes) {
              // Handle home save error
              if (homeSaveErr) {
                return done(homeSaveErr);
              }

              // Set assertions on new home
              (homeSaveRes.body.title).should.equal(home.title);
              should.exist(homeSaveRes.body.user);
              should.equal(homeSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the home
                  agent.get('/api/homes/' + homeSaveRes.body._id)
                    .expect(200)
                    .end(function (homeInfoErr, homeInfoRes) {
                      // Handle home error
                      if (homeInfoErr) {
                        return done(homeInfoErr);
                      }

                      // Set assertions
                      (homeInfoRes.body._id).should.equal(homeSaveRes.body._id);
                      (homeInfoRes.body.title).should.equal(home.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (homeInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Home.remove().exec(done);
    });
  });
});
