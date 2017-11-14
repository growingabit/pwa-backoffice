require('./style/main.scss');

require('auth0-js');
var angular = require('angular');
require('angular-resource');
require('@uirouter/angularjs');
require('angular-jwt');
require('angular-auth0');

var app = angular.module('app', [ 'ui.router', 'ngResource', 'auth0.auth0', 'angular-jwt' ]);

require('./services/Auth');
require('./services/Invitation');

require('./components/callback/callback');
require('./components/home/home');
require('./components/invitation/invitation');

// apiBaseUrl is defined during build by WEBPACK
app.constant('API_BASE_URL', apiBaseUrl); // eslint-disable-line angular/file-name, angular/function-type

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, angularAuth0Provider, jwtOptionsProvider) {

  $stateProvider
    .state({
      name : 'home',
      url : '/home',
      component : 'home'
    })
    .state({
      name : 'invitation',
      url : '/invitation',
      component : 'invitation'
    })
    .state({
      name : 'callback',
      url : '/callback',
      component : 'callback'
    });

  // Initialization for the angular-auth0 library
  // auth0CLientID, auth0Domain and auth0CallbakUrl
  // are defined during build by WEBPACK
  angularAuth0Provider.init({
    clientID : auth0CLientID,
    domain : auth0Domain,
    responseType : 'token id_token',
    audience : 'https://' + auth0Domain + '/userinfo',
    redirectUri : auth0CallbakUrl,
    scope : 'openid'
  });

  $locationProvider.hashPrefix('');

  $urlRouterProvider.otherwise('home');

  jwtOptionsProvider.config({
    tokenGetter : function() {
      return localStorage.getItem('id_token');
    },
    whiteListedDomains: ['api.growbit.xyz', 'growbit-0-dev.appspot.com', 'localhost']
  });

  $httpProvider.interceptors.push('jwtInterceptor');
});

app.run(function(Auth) {
  Auth.handleAuthentication();
});
