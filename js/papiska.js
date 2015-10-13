angular.module(
	'papiska',
	[
		'ui.router',
		'ngMaterial'
	])
	.config(function($mdThemingProvider) {
		$mdThemingProvider
			.theme('default')
			.primaryPalette('red')
			.accentPalette('lime')
			.warnPalette('pink');
	})
	.config(function($mdIconProvider) {
		$mdIconProvider
			.defaultFontSet('fontawesome');
	})
	.controller('MainController', function($scope, $mdSidenav, $mdUtil) {
		$scope.toggleMainNav = $mdUtil.debounce(function() {
			$mdSidenav('main')
				.toggle();
		}, 200);
	})
	.config(function($urlRouterProvider) {
		$urlRouterProvider
			.otherwise('/');
	})
	.config(function($stateProvider) {
		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'home/index.html',
				controller: 'HomeController'
			});
	})
	.controller('HomeController', function() {

	});
