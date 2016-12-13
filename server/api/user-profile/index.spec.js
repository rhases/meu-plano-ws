'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var userProfileCtrlStub = {
  index: 'userProfileCtrl.index',
  show: 'userProfileCtrl.show',
  create: 'userProfileCtrl.create',
  update: 'userProfileCtrl.update',
  destroy: 'userProfileCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var userProfileIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './user-profile.controller': userProfileCtrlStub
});

describe('UserProfile API Router:', function() {

  it('should return an express router instance', function() {
    userProfileIndex.should.equal(routerStub);
  });

  // describe('GET /api/user-profiles', function() {
  //
  //   it('should route to userProfile.controller.index', function() {
  //     routerStub.get
  //       .withArgs('/', 'userProfileCtrl.index')
  //       .should.have.been.calledOnce;
  //   });
  //
  // });

  describe('GET /api/user-profiles/:id', function() {

    it('should route to userProfile.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'userProfileCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/user-profiles', function() {

    it('should route to userProfile.controller.create', function() {
      routerStub.post
        .withArgs('/', 'userProfileCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/user-profiles/:id', function() {

    it('should route to userProfile.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'userProfileCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/user-profiles/:id', function() {

    it('should route to userProfile.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'userProfileCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/user-profiles/:id', function() {

    it('should route to userProfile.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'userProfileCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
