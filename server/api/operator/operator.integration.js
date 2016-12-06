'use strict';

var app = require('../../..');
import request from 'supertest';

var _id = 'amil';

describe('Operator API:', function() {

  describe('GET /api/health-insurance/operators', function() {
    var operators;

    beforeEach(function(done) {
      request(app)
        .get('/api/health-insurance/operators')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          operators = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      operators.should.be.instanceOf(Array);
    });

  });

  describe('GET /api/health-insurance/operators/:id', function() {
    var operator;

    beforeEach(function(done) {
      request(app)
        .get('/api/health-insurance/operators/' + _id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          operator = res.body;
          done();
        });
    });

    afterEach(function() {
      operator = {};
    });

    it('should respond with the requested operator', function() {
      operator.name.should.equal('Amil');
    });

  });

});
