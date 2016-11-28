var app = angular.module('tvchat', [
	'ionic',
	'ngCordova',
	'ngOpenFB',
	'firebase',
	'angularMoment',
	'tvchat.controllers',
	'tvchat.services',
	'tvchat.filters',
	'tvchat.utils',

	'ionic.service.core',
  'ionic.service.push'


]);
app.constant("FIREBASE_URL", 'tvchat-prod-a985d.firebaseapp.com');

app.constant("FACEBOOK_APP_ID", '1055438874575938');



app.run(function ($rootScope, $ionicPlatform, $cordovaStatusbar) {


		$ionicPlatform.ready(function () {
             
          
			// Hide the accessory bar by default
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}
			// Color the iOS status bar text to white
			if (window.StatusBar) {
				$cordovaStatusbar.overlaysWebView(true);
				$cordovaStatusbar.style(0); //Light
			}
		});
	});

app.run(function (ngFB, FACEBOOK_APP_ID) {
	ngFB.init({appId: FACEBOOK_APP_ID});
});

app.config(function ($stateProvider, $urlRouterProvider,$ionicAppProvider) {

      $ionicAppProvider.identify({
           app_id: '3452a6b8',
           api_key: 'c140579f3598d3cad20ee77c09ba00800397b4c6c3263d36',
           dev_push: true
         });

		$stateProvider
			.state('intro', {
				url: '/',
				templateUrl: 'templates/intro.html',
				controller: 'IntroCtrl'
			})

			.state('app', {
				url: "/app",
				abstract: true,
				templateUrl: "templates/menu.html",
				controller: 'MenuCtrl'
			})

			.state('app.search', {
				url: "/search",
				views: {
					'menuContent': {
						templateUrl: "templates/search.html",
						controller: 'SearchCtrl'
					}
				}
			})

			.state('app.show', {
				url: "/show/:showId",
				cache: false,
				views: {
					'menuContent': {
						templateUrl: "templates/show.html",
						controller: 'ShowCtrl'
					}
				}
			})
		;

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/');

	});
