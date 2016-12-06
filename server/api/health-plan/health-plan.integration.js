'use strict';

var app = require('../../..');
import request from 'supertest';

var _id = 'amil-400';

describe('HealthPlan API:', function() {

  describe('GET /api/health-insurance/health-plans', function() {
    var healthPlans;

    beforeEach(function(done) {
      request(app)
        .get('/api/health-insurance/health-plans')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          healthPlans = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      healthPlans.should.be.instanceOf(Array);
    });

  });

  describe('GET /api/health-insurance/health-plans/:id', function() {
    var healthPlan;

    beforeEach(function(done) {
      request(app)
        .get('/api/health-insurance/health-plans/' + _id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          healthPlan = res.body;
          done();
        });
    });

    afterEach(function() {
      healthPlan = {};
    });

    it('should respond with the requested healthPlan', function() {
	  healthPlan.Procedure.name.should.equal('Amil');
      healthPlan.name.should.equal('400');
    });

  });

});
