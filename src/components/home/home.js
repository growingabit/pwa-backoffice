var angular = require('angular');

function HomeController(Auth) {
  this.Auth = Auth;

  this.logout = function(){
    Auth.logout();
    location.reload();
  };
}

angular.module('app').component('home', {
  template: require('./home.html'),
  controller : HomeController
});
