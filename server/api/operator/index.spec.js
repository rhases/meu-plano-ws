'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var ProcedureCtrlStub = {
  index: 'ProcedureCtrl.index',
  show: 'ProcedureCtrl.show',
};

var routerStub = {
  get: sinon.spy(),
};

// require the index with our stubbed out modules
var ProcedureIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './Procedure.controller': ProcedureCtrlStub
});

describe('Procedure API Router:', function() {

  it('should return an express router instance', function() {
    ProcedureIndex.should.equal(routerStub);
  });

  describe('GET /api/health-insurance/Procedures', function() {

    it('should route to Procedure.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProcedureCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/health-insurance/Procedures/:id', function() {

    it('should route to Procedure.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProcedureCtrl.show')
        .should.have.been.calledOnce;
    });

  });

});
