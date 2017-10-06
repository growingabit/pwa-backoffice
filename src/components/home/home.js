var template = require('./home.html');

var HomeController = function(Auth) {
  this.Auth = Auth;

  this.logout = function(){
    Auth.logout();
    location.reload();
  };
}

module.export = {
  template: template,
  controller : HomeController
};
