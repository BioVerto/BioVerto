angular.module("MyApp")
        .controller('mainController', function($scope, $modal,modalCtrlProvider) {
            $scope.views = []
            $scope.viewable = []
            $scope.active = 0;
            $scope.addView = function(layout,graphName)
            {
                for (var i = 0; i < $scope.viewable.length; i++)
                {
                    $scope.viewable[i] = false;
                }
                $scope.viewable.push(true);
                $scope.views.push({layout: layout, title: "New View " + $scope.views.length,graphName:graphName});
            };
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


