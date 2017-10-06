require('./style/main.scss');

require('auth0-js');
var angular = require('angular');
require('angular-resource');
require('angular-ui-router');
require('angular-jwt');
require('angular-auth0');

var authService = require('./services/Auth');
var invitationService = require('./services/invitation');

var callbackComponent = require('./components/callback/callback');
var homeComponent = require('./components/home/home');
var invitationComponent = require('./components/invitation/invitation');

angular
  .module('app', [ 'ui.router', 'ngResource', 'auth0.auth0', 'angular-jwt' ])

  // apiBaseUrl is defined during build by WEBPACK
  .constant('API_BASE_URL', apiBaseUrl)

  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, angularAuth0Provider, jwtOptionsProvider) {

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
      }
    });

    $httpProvider.interceptors.push('jwtInterceptor');
  })

  .run(function(Auth) {
    Auth.handleAuthentication();
  })

  .factory('Invitation', invitationService)
  .factory('Auth', authService)
  // .component('invitation', invitationComponent)
  // .component('home', homeComponent)
  // .component('callback', callbackComponent);
