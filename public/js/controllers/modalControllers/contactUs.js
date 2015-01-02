 if (typeof  modalControllers === 'undefined')
 modalControllers = {};
 
 modalControllers.contactUs = function($scope, $modalInstance) {
               
                $scope.ok = function() {
                     $modalInstance.close();
                }
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            };