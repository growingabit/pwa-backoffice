var template = require('./invitation.html');

var InvitationController = function($state, Invitation) {
  'use strict'

  this.save = function(invitation) {
    console.log(invitation)
    console.log("creating...")
    Invitation.save(invitation, function(data) {
      ctrl.invitations.push(data);
    });
  };

  this.update = function(invitation){
    Invitation.save(invitation, function(){
      alert("Gone");
    });
  }

  this.invitations = Invitation.query();
}

module.export = {
  template : template,
  controller : InvitationController
}
