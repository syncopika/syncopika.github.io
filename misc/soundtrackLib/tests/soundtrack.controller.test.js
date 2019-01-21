//	help for karma unit testing !
//	http://www.bradoncode.com/blog/2015/05/19/karma-angularjs-testing/

var fakeData = [{"series": "Hidamari Sketch (ひだまりスケッチ)"}, {"series": "Denpa Onna To Seishun Otoko (電波女と青春男)"}, {"series": "Bakemonogatari (化物語)"}];

describe('soundtrackLibrary', function(){
	
	beforeEach(module('appControllers'));
	
	var $controller;
	
	beforeEach(inject(function(_$controller_){
		$controller = _$controller_;
	}));
	
	// just testing the controller's scope functions 
	// test $scope.sortAscOrDesc
	describe('sortOrder', function(){
		it('the soundtracks should be in a-z order by series name', function(){
			var $scope = {}; // set up an empty scope 
			
			// attach to controller
			var controller = $controller('MyController', {$scope: $scope});
			
			// add some fake data to scope 
			$scope.soundtracks = fakeData;
			$scope.sortType = false;
			$scope.sortAscOrDesc(); // sort the data 
			
			// make sure count is correct 
			expect($scope.soundtracks.length).toBe(3);
			
			// make sure order is as expected 
			// should be ascending since sortType is false 
			expect($scope.soundtracks[0].series).toBe("Bakemonogatari (化物語)");
			expect($scope.soundtracks[1].series).toBe("Denpa Onna To Seishun Otoko (電波女と青春男)");
			expect($scope.soundtracks[2].series).toBe("Hidamari Sketch (ひだまりスケッチ)");
		});
	});
	
});