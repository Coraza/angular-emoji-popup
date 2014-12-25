'use strict';

emojiApp.controller('emojiController', ['$scope', '$log', function($scope, $log) {

	$scope.emoji = {};
	$scope.emojiMessage={};

	

	$scope.emoji.replyToUser = function()
	{
		alert('You typed' + $scope.messagetext);
	}


}]);
