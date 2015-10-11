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
	});
