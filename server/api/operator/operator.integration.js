'use strict';

var app = require('../../..');
import request from 'supertest';

var _id = 'amil';

describe('Procedure API:', function() {

  describe('GET /api/health-insurance/Procedures', function() {
    var Procedures;

    beforeEach(function(done) {
      request(app)
        .get('/api/health-insurance/Procedures')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Procedures = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Procedures.should.be.instanceOf(Array);
    });

  });

  describe('GET /api/health-insurance/Procedures/:id', function() {
    var Procedure;

    beforeEach(function(done) {
      request(app)
        .get('/api/health-insurance/Procedures/' + _id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Procedure = res.body;
          done();
        });
    });

    afterEach(function() {
      Procedure = {};
    });

    it('should respond with the requested Procedure', function() {
      Procedure.name.should.equal('Amil');
    });

  });

});
