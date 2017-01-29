var appControllers = angular.module('appControllers', []);

appControllers.controller('MyController', ['$scope', '$http', function($scope, $http){
	
	$http.get('soundtracks.json').then(function(response){
		$scope.soundtracks = response.data;
	});
	
	$scope.startFilter = false;
	/*
	var alphabet = [];
	for(var i = 97; i < 123; i++){
		alphabet.push(String.fromCharCode(i));
	}
	$scope.alphabet = alphabet;
	console.log(alphabet);
	*/
}]);

appControllers.controller('DetailsController', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http){
	
	$http.get('soundtracks.json').then(function(response){
		$scope.soundtracks = response.data;
	});
	$scope.whichItem = $routeParams.itemId;
	
}]);

appControllers.filter('matchFirstLetter', function(){
	return function(soundtracks, startFilter){
		if(startFilter === false){
			return soundtracks;
		}
		var filtered = [];
		angular.forEach(soundtracks, function(listing){
			if(listing.series[0].toLowerCase() === startFilter){
				filtered.push(listing);
			}
		});
		return filtered;
	}
});
