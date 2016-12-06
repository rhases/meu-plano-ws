'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var operatorCtrlStub = {
  index: 'operatorCtrl.index',
  show: 'operatorCtrl.show',
};

var routerStub = {
  get: sinon.spy(),
};

// require the index with our stubbed out modules
var operatorIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './operator.controller': operatorCtrlStub
});

describe('Operator API Router:', function() {

  it('should return an express router instance', function() {
    operatorIndex.should.equal(routerStub);
  });

  describe('GET /api/health-insurance/operators', function() {

    it('should route to operator.controller.index', function() {
      routerStub.get
        .withArgs('/', 'operatorCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/health-insurance/operators/:id', function() {

    it('should route to operator.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'operatorCtrl.show')
        .should.have.been.calledOnce;
    });

  });

});
