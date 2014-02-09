angular.module("MyApp")
        .controller('mainController', function($scope, $modal,modalCtrlProvider) {
            $scope.views = {};
            $scope.active = 0;
            $scope.newViewIndex = 0;
            
            $scope.addView = function(layout,graphName)
            {
                $scope.views[$scope.newViewIndex]={layout: layout, title: "New View " +$scope.newViewIndex,graphName:graphName,indx:$scope.newViewIndex};
                $scope.newViewIndex++;
            };
            $scope.removeView = function(index)
            {
             //   delete $scope.views[index];
            }
            $scope.changeView = function(indx)
            {
                $scope.active = indx;

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
                modalInstance.result.then(function(newGraph) {
                  
                }, function() {
                    
                    return;
                });

            };
            $scope.databaseDownload = function(plugin)
            {
               var modalInstance = $modal.open({
                    templateUrl: './partials/'+plugin+'DBOpen.html',
                    controller: modalCtrlProvider.getCtrl(plugin),
                });
                modalInstance.result.then(function(newGraph) {
               
                  $scope.addView(newGraph.layout,newGraph.graphName);
                }, function() {
                    return;
                });
    
            }
            
            
        });


