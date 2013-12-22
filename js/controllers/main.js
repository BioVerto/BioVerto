angular.module("MyApp")
    .controller('mainController', function($scope,$log,$modal) {
    $scope.views = []
    $scope.viewable = []
    $scope.addView = function()
    {
        for(var i =0;i<$scope.viewable.length;i++)
        {
            $scope.viewable[i]=false;
        }
        $scope.viewable.push(true);
        $scope.views.push({title:"New View "+ $scope.views.length});
    }
    $scope.changeView = function(indx)
    {
        for(var i =0;i<$scope.viewable.length;i++)
        {
            $scope.viewable[i]=false;
        }
        $scope.viewable[indx]=true;

    }
});


