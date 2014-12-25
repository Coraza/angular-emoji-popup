'use strict';

emojiApp.controller('emojiController', ['$scope', '$log', function($scope, $log) {

	$scope.emojiMessage={};
	$scope.decodeType='colon';

	$scope.emojiMessage.replyToUser = function()
	{
		alert('You typed ' + $scope.emojiMessage.messagetext);
	}


}]);
