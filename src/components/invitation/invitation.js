var angular = require('angular');

var InvitationController = function($state, Invitation) {
  'use strict'

  this.invitations = Invitation.query();

  this.save = function(invitation) {
    console.log(invitation)
    console.log("creating...")
    Invitation.save(invitation, function(data) {
      this.invitations.push(data);
    }.bind(this));
  };

  this.update = function(invitation){
    Invitation.save(invitation, function(){
      alert("Gone");
    });
  }

}

angular.module('app').component('invitation', {
  template: require('./invitation.html'),
  controller : InvitationController
});
