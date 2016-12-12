'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var healthProviderCtrlStub = {
  index: 'healthProviderCtrl.index',
  show: 'healthProviderCtrl.show',
  create: 'healthProviderCtrl.create',
  update: 'healthProviderCtrl.update',
  destroy: 'healthProviderCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var healthProviderIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './health-provider.controller': healthProviderCtrlStub
});

describe('Provider API Router:', function() {

  it('should return an express router instance', function() {
    healthProviderIndex.should.equal(routerStub);
  });

  // describe('GET /api/health-provider', function() {
  //
  //   it('should route to healthProvider.controller.index', function() {
  //     routerStub.get
  //       .withArgs('/', 'healthProviderCtrl.index')
  //       .should.have.been.calledOnce;
  //   });
  //
  // });

  describe('GET /api/health-provider/:id', function() {

    it('should route to healthProvider.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'healthProviderCtrl.show')
        .should.have.been.calledOnce;
    });

  });
  //
  // describe('POST /api/health-provider', function() {
  //
  //   it('should route to healthProvider.controller.create', function() {
  //     routerStub.post
  //       .withArgs('/', 'healthProviderCtrl.create')
  //       .should.have.been.calledOnce;
  //   });
  //
  // });
  //
  // describe('PUT /api/health-provider/:id', function() {
  //
  //   it('should route to healthProvider.controller.update', function() {
  //     routerStub.put
  //       .withArgs('/:id', 'healthProviderCtrl.update')
  //       .should.have.been.calledOnce;
  //   });
  //
  // });
  //
  // describe('PATCH /api/health-provider/:id', function() {
  //
  //   it('should route to healthProvider.controller.update', function() {
  //     routerStub.patch
  //       .withArgs('/:id', 'healthProviderCtrl.update')
  //       .should.have.been.calledOnce;
  //   });
  //
  // });
  //
  // describe('DELETE /api/health-provider/:id', function() {
  //
  //   it('should route to healthProvider.controller.destroy', function() {
  //     routerStub.delete
  //       .withArgs('/:id', 'healthProviderCtrl.destroy')
  //       .should.have.been.calledOnce;
  //   });
  //
  // });

});
