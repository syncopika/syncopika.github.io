var appControllers = angular.module('appControllers', []);

appControllers.controller('MyController', ['$scope', '$http', function($scope, $http){
	
	$http.get('soundtracks.json').then(function(response){
		$scope.soundtracks = response.data;
	});
	
	$scope.startFilter = false;
	
	// set to false initially because if not set, soundtracks will be undefined breifly but the sort function will attempt to use soundtracks and throw an error
	$scope.sortOrder = false; 
	
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

// filter data that have titles that start with the selected letter 
appControllers.filter('matchFirstLetter', function(){
	return function(soundtracks, startFilter){
		if(startFilter === false){
			// it will be false when you deselect a button since it can only be either true or false when clicked. 
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

// sort the soundtracks based on the first character of their series' name 
appControllers.filter('sortAscOrDesc', function(){
	return function(soundtracks, sortType){
		
		if(soundtracks === undefined){
			return;
		}
		
		// this alters the original data!
		if(sortType === false){
			// sort ascending (a - z)
			soundtracks.sort(function(a, b){
				return a.series.charCodeAt(0) - b.series.charCodeAt(0);
			});
		}else{
			// sort descending (z - a)
			soundtracks.sort(function(a, b){
				return b.series.charCodeAt(0) - a.series.charCodeAt(0);
			});
		}
		return soundtracks;
	}
});

