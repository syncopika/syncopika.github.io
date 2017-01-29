var myApp = angular.module('myApp', [
	'ngRoute',
	'appControllers',
	'ui.bootstrap'
]);

myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.
	when('/list', {
		templateUrl: 'partials/list.html',
		controller: 'MyController'
	}).
	when('/details/:itemId', {
		templateUrl: 'partials/details.html',
		controller: 'DetailsController'
	}).
	when('/about', {
		templateUrl: 'partials/about.html',
		controller: ''
	}).
	otherwise({
		redirectTo: '/list'
	});
	
	$locationProvider.hashPrefix('');
}]);

