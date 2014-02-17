if (typeof modalControllers === 'undefined')
    modalControllers = {};

modalControllers.feedback = function($scope, $modalInstance) {
    $scope.eid = "";
    $scope.userName = "";
    $scope.details = "";
    $scope.changedUserName = function(newName)
    {
        $scope.userName = newName;
    };
    $scope.changedEmail = function(newName)
    {
        $scope.eid = newName;
    };
    $scope.changedDetails = function(newName)
    {
        $scope.details = newName;
    };

    $scope.submitFeedback = function() {
        $modalInstance.close({eid: $scope.eid, name: $scope.userName, detail: $scope.details});
    }
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};