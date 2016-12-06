'use strict';

var app = require('../..');
import request from 'supertest';

var newUserProfile;

describe('UserProfile API:', function() {

  describe('GET /api/user-profiles', function() {
    var userProfiles;

    beforeEach(function(done) {
      request(app)
        .get('/api/user-profiles')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          userProfiles = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      userProfiles.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/user-profiles', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/user-profiles')
        .send({
          _id: 'joaquina@gmail.com',
          name: 'Joaquina Bourbon'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newUserProfile = res.body;
          done();
        });
    });

    it('should respond with the newly created userProfile', function() {
      newUserProfile.name.should.equal('Joaquina Bourbon');
    });

  });

  describe('GET /api/user-profiles/:id', function() {
    var userProfile;

    beforeEach(function(done) {
      request(app)
        .get('/api/user-profiles/' + newUserProfile._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          userProfile = res.body;
          done();
        });
    });

    afterEach(function() {
      userProfile = {};
    });

    it('should respond with the requested userProfile', function() {
      userProfile.name.should.equal('Joaquina Bourbon');
    });

  });

  describe('PUT /api/user-profiles/:id', function() {
    var updatedUserProfile;

    beforeEach(function(done) {
      request(app)
        .put('/api/user-profiles/' + newUserProfile._id)
        .send({
          name: 'Joaquina Bourbon III',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedUserProfile = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedUserProfile = {};
    });

    it('should respond with the updated userProfile', function() {
      updatedUserProfile.name.should.equal('Joaquina Bourbon III');
    });

  });

  describe('DELETE /api/user-profiles/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/user-profiles/' + newUserProfile._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when userProfile does not exist', function(done) {
      request(app)
        .delete('/api/user-profiles/' + newUserProfile._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
