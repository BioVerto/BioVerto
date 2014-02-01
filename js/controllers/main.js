angular.module("MyApp")
        .controller('mainController', function($scope, $modal,modalCtrlProvider) {
            $scope.views = []
            $scope.viewable = []
            $scope.addView = function(layout)
            {
                for (var i = 0; i < $scope.viewable.length; i++)
                {
                    $scope.viewable[i] = false;
                }
                $scope.viewable.push(true);
                $scope.views.push({layout: layout, title: "New View " + $scope.views.length});
            }
            $scope.changeView = function(indx)
            {
                for (var i = 0; i < $scope.viewable.length; i++)
                {
                    $scope.viewable[i] = false;
                }
                $scope.viewable[indx] = true;

            }
            $scope.fileUpload = function(plugin)
            {
               $scope.fileType;
                $scope.fileData;
                $scope.fileName;
                var modalInstance = $modal.open({
                    templateUrl: './partials/'+plugin+'FileOpen.html',
                    controller: modalCtrlProvider.getCtrl(plugin),
                });
                modalInstance.result.then(function(file) {
                }, function() {
                    return;
                });

            }
            
        });


