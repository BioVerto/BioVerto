 if (typeof  modalControllers === 'undefined')
 modalControllers = {};
 
 modalControllers.databaseGraphs = function($scope, $modalInstance, $http) {
                $scope.view_tab = 'tab1';
                $scope.result = "";
                $scope.dbGroup = [];
                $scope.makeRequest = function() {
                    $http.get("/listGraphs").success(function(result) {
                    $scope.graphs = result;
                        var flags = {}, dbGroup = [];
                        for( i=0; i<result.length; i++) {
                            if( flags[result[i].dbGroup]) continue;
                            flags[result[i].dbGroup] = true;
                            dbGroup.push(result[i].dbGroup);
                        }

                        $scope.dbGroup = dbGroup;
                    });

                }();
                $scope.uploadGraph = function(graph){
                    $http.get("/getDb",{responseType: "arraybuffer",params:{dbFile:graph.dbFile,title:graph.title}}).success(function(result) {
                        var blob = new Uint8Array(result);
                        var   db = new GraphSqliteDb(new SQL.Database(blob));
                        g5.loadGraph(graph,db,graph.title);
                        $modalInstance.close({layout: "force", graphName:graph.title});
                    });
                }
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
                $scope.changeTab = function(tab){
                    $scope.view_tab = tab;
                }

            };