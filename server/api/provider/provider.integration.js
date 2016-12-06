'use strict';

var app = require('../..');
import request from 'supertest';

var newProvider;

describe('Provider API:', function() {

  describe('GET /api/providers', function() {
    var providers;

    beforeEach(function(done) {
      request(app)
        .get('/api/providers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          providers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      providers.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/providers', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/providers')
        .send({
          name: 'New Provider',
          info: 'This is the brand new provider!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newProvider = res.body;
          done();
        });
    });

    it('should respond with the newly created provider', function() {
      newProvider.name.should.equal('New Provider');
      newProvider.info.should.equal('This is the brand new provider!!!');
    });

  });

  describe('GET /api/providers/:id', function() {
    var provider;

    beforeEach(function(done) {
      request(app)
        .get('/api/providers/' + newProvider._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          provider = res.body;
          done();
        });
    });

    afterEach(function() {
      provider = {};
    });

    it('should respond with the requested provider', function() {
      provider.name.should.equal('New Provider');
      provider.info.should.equal('This is the brand new provider!!!');
    });

  });

  describe('PUT /api/providers/:id', function() {
    var updatedProvider;

    beforeEach(function(done) {
      request(app)
        .put('/api/providers/' + newProvider._id)
        .send({
          name: 'Updated Provider',
          info: 'This is the updated provider!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedProvider = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProvider = {};
    });

    it('should respond with the updated provider', function() {
      updatedProvider.name.should.equal('Updated Provider');
      updatedProvider.info.should.equal('This is the updated provider!!!');
    });

  });

  describe('DELETE /api/providers/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/providers/' + newProvider._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when provider does not exist', function(done) {
      request(app)
        .delete('/api/providers/' + newProvider._id)
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
