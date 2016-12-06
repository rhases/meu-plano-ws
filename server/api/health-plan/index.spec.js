'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var healthPlanCtrlStub = {
  index: 'healthPlanCtrl.index',
  show: 'healthPlanCtrl.show',
};

var routerStub = {
  get: sinon.spy(),
  use: sinon.spy()
};

// require the index with our stubbed out modules
var healthPlanIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './health-plan.controller': healthPlanCtrlStub
});

describe('HealthPlan API Router:', function() {

  it('should return an express router instance', function() {
    healthPlanIndex.should.equal(routerStub);
  });

  describe('GET /api/health-insurance/health-plans', function() {

    it('should route to healthPlan.controller.index', function() {
      routerStub.get
        .withArgs('/', 'healthPlanCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/health-insurance/health-plans/:id', function() {

    it('should route to healthPlan.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'healthPlanCtrl.show')
        .should.have.been.calledOnce;
    });

  });

});
