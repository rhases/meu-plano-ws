'use strict';

var _ = require('lodash');

var logger = require('log4js').getLogger();

var tags = ['schdlr_invite_requested', 'schdlr_invited_beta', 'schdlr_recommended_by_peer', 'schdlr_registered', 'schdlr_scheduled', 'schdlr_sent_an_invitation'];


exports.inviteAuthStatus = function(invite){
  function has(tag){
    if(invite && invite.tags.indexOf(tag)>=0){
      return true;
    }else{
      return false;
    }
  }
  if(has('schdlr_registered')){
    return 'registered';
  }else if(has('schdlr_invited_beta')){
    return 'invited';
  }else if(has('schdlr_invite_requested')){
    return 'invite_requested';
  }else {
    return 'not_invited';
  }
}
