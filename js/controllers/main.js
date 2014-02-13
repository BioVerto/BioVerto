angular.module("MyApp")
        .controller('mainController', function($scope, $modal,modalCtrlProvider) {
            $scope.views = {};
            $scope.active = 0;
            $scope.newViewIndex = 0;
            
            $scope.addView = function(layout,graphName)
            {
                if($scope.newViewIndex!==0&&typeof graphName==='undefined')
                {
                    console.log("came here")
                    graphName = $scope.views[$scope.active]. graphName;
                };
                $scope.views[$scope.newViewIndex]={layout: layout, title: "New View " +$scope.newViewIndex,graphName:graphName,indx:$scope.newViewIndex};
                $scope.newViewIndex++;
            };
            $scope.removeView = function(index)
            {
                // First delete this view
                delete $scope.views[index];
                // Select another view to be the active view
                // Simply pick the first view available
                // This is ugly but effective. There is no API to do this
                for (var i in $scope.views){
                    $scope.changeView(i);
                    return; // we got the first one
                } 
                $scope.newViewIndex = 0;
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


