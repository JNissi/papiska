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
			.accentPalette('purple')
			.warnPalette('pink');
	})
	.config(function($mdIconProvider) {
		$mdIconProvider
			.defaultFontSet('material-icons');
	})
	.controller('MainController', function($scope, $mdSidenav, $mdUtil, $state) {
		$scope.go = function() {
			$mdSidenav('main')
				.close();
			$state.go.apply($state, arguments);
		};

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
			})
			.state('nowplaying', {
				url: '/nowplaying',
				templateUrl: 'nowplaying/index.html',
				controller: 'NowplayingController'
			})
			.state('queue', {
				url: '/queue',
				templateUrl: 'queue/index.html',
				controller: 'QueueController'
			});
	})
	.controller('HomeController', function($scope) {
	})
	.controller('NowplayingController', function($scope, mopidy, $timeout) {
		console.log(mopidy, mopidy.getUriSchemes);
		mopidy.on(function(type, ev) {
			if (type !== 'websocket:incomingMessage' && type !== 'websocket:outgoingMessage') {
				console.log.apply(console, arguments);
			}
		});
		mopidy.on('state:online', function() {
			mopidy.playback.getCurrentTrack({}).then(function(track) {
				console.log(track);
				$scope.$apply(function(scope) {
					scope.currentTrack = track;
				});
			});
			mopidy.playback.getState({}).then(function(state) {
				$scope.$apply(function(scope) {
					scope.state = state.new_state;
				});
			});
			(function getTimePosition() {
				mopidy.playback.getTimePosition({}).then(function(time) {
					$scope.$apply(function(scope) {
						scope.timePosition = time;
					});
					$timeout(getTimePosition, 100);
				});
			})();
		});

		mopidy.on('event:trackPlaybackStarted', function(data) {
			$scope.$apply(function(scope) {
				scope.currentTrack = data.tl_track.track;
			});
		});

		mopidy.on('event:playbackStateChanged', function(data) {
			$scope.$apply(function(scope) {
				scope.state = data.new_state;
			});
		});

		$scope.resume = function() {
			mopidy.playback.resume();
		};

		$scope.pause = function() {
			mopidy.playback.pause();
		};

		$scope.next = function() {
			mopidy.playback.next();
		};

		$scope.previous = function() {
			mopidy.playback.previous();
		};
	})
	.controller('QueueController', function($scope, mopidy) {
		mopidy.on('state:online', function() {
			mopidy.tracklist.getTracks({}).then(function(data) {
				$scope.$apply(function(scope) {
					scope.queue = data;
				});
			});
		});
	})
	.factory('mopidy', function() {
		var mopidy = new Mopidy({
			webSocketUrl: "ws://localhost:6680/mopidy/ws/",
			callingConvention: "by-position-or-by-name"
		});

		return mopidy;
	})
	.factory('currentTrack', function() {

	})
	.filter('time', function() {
		return function(input) {
			var out = '';
			input = +input || 0;

			out += ('0' + ((input / 60000) | 0)).slice(-2) + ':';
			out += ('0' + (((input % 60000) / 1000) | 0)).slice(-2);

			return out;
		};
	})
;
