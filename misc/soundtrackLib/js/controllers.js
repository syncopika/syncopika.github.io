// use a service to share soundtrack data between controllers 
// https://stackoverflow.com/questions/22584342/how-to-share-the-scope-variable-of-one-controller-with-another-in-angularjs
var appControllers = angular.module('appControllers', []).service('Shared', function(){return {}});

appControllers.controller('MyController', ['$scope', '$http', 'Shared', function($scope, $http, Shared){
	
	$http.get('soundtracks.json').then(function(response){
		$scope.soundtracks = response.data;
		$scope.shared = Shared;
		$scope.shared.soundtrackData = $scope.soundtracks;
		
		// add to sessionStorage 
		sessionStorage.setItem('soundtrackData', JSON.stringify($scope.soundtracks));
	});
	
	$scope.startFilter = false;
	
	// set to false initially because if not set, soundtracks will be undefined breifly but the sort function will attempt to use soundtracks and throw an error
	// this specifies if the sort should be in descending or ascending order
	$scope.sortType = false; 
	
	// sort the soundtracks based on the first character of their series' name 
	$scope.sortAscOrDesc = function(){	
	
		if($scope.soundtracks === undefined){
			return;
		}
		
		// this alters the original data!
		if($scope.sortType === false){
			// sort ascending (a - z)
			$scope.soundtracks.sort(function(a, b){
				return a.series.charCodeAt(0) - b.series.charCodeAt(0);
			});
			$scope.sortType = true;
		}else{
			// sort descending (z - a)
			$scope.soundtracks.sort(function(a, b){
				return b.series.charCodeAt(0) - a.series.charCodeAt(0);
			});
			$scope.sortType = false;
		}
	}
	
	// find index of a particular album listing in the soundtracks array 
	$scope.findIndex = function(listing){
		for(var i = 0; i < $scope.soundtracks.length; i++){
			if($scope.soundtracks[i].series === listing.series){
				return i;
			}
		}
		return 0;
	}
	
	// get a csv file of the soundtrack json data 
	$scope.getCSV = function(){
		// help? https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
		// https://stackoverflow.com/questions/17103398/convert-javascript-variable-value-to-csv-file

		var csvLines = "";
		
		// get the fields for the csv 
		for(var field in $scope.soundtracks[0]){
			if(field === "$$hashKey"){
				continue;
			}
			csvLines += field + ",";
		}
		
		//replace last comma with newline 
		csvLines = csvLines.replace(/,$/, "\n");
		
		// add each row of data 
		for(var i = 0; i < $scope.soundtracks.length; i++){
			var currRow = $scope.soundtracks[i];
			var currLine = "";
			for(var field in currRow){
				if(field === "$$hashKey"){
					continue;
				}
				if(currRow[field] === ""){
					// there might not be an image or special note 
					currLine += "\"\",";
				}else{
					var val = currRow[field];
					val = val.replace(/\"/g, "'"); // replace any double quotes with single quotes
					val = "\"" + val + "\""; // the value might contain commas, so enclose in quotes
					val = val.replace(/\\n/g, "");
					currLine += val + ",";
				}
			}
			
			// then replace the trailing comma with a new line
			currLine = currLine.replace(/,$/g, "\n");
			
			csvLines += currLine;
		}
		
		csvLines = [csvLines];
		var dataBlob = new Blob(csvLines, {type: 'text/csv'});
		var url = URL.createObjectURL(dataBlob);
		
		// make a link and activate it 
		var link = document.createElement('a');
		link.download = "soundtracks.csv";
		link.href = url;
		link.click();
	}
	
}]);

appControllers.controller('DetailsController', ['$scope', '$routeParams', '$http', 'Shared', function($scope, $routeParams, $http, Shared){
	
	// use the data already retrieved by MyController!
	//$scope.shared = Shared;
	//$scope.soundtracks = $scope.shared.soundtrackData;
	
	// but when you refresh, the data gets lost!
	// https://stackoverflow.com/questions/22408790/angularjs-passing-data-between-pages
	// console.log($scope.soundtracks)
	
	// so I'll just rely on sessionStorage to keep the same data around even when refreshing 
	$scope.soundtracks = JSON.parse(sessionStorage.getItem('soundtrackData'));

	/*
	if($scope.soundtracks === undefined){
		$http.get('soundtracks.json').then(function(response){
			$scope.soundtracks = response.data;
		});
	}*/
	
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



