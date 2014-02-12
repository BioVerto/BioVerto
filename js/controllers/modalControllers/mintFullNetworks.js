 if (typeof  modalControllers === 'undefined')
 modalControllers = {};
 modalControllers.mintFullNetworks = function($scope, $modalInstance, $http, d3, $q) {
                $scope.availableOrgList = [];
                $scope.uploadButtonEnable = true;
                $scope.state = 'uploadState';
                $scope.selectedOrgName = "";
                getAvailableOptions();

                $scope.pathwayUpload = function(selectedNetwork)
                {
                    $scope.uploadButtonEnable = false;
                    $http.get("http://www.cise.ufl.edu/~adobra/BioVerto/MINT-full/" + selectedNetwork.fileName + "_all.graph").success(function(result) {
                        $scope.blob = "Source\tTarget\tValue1\tValue2\tValue3\n" + result;
                        g5.loadGraphFromFile("mint", $scope.blob,selectedNetwork.name, "Source", "Target",true);
                        $modalInstance.close({layout: "force", graphName:selectedNetwork.name});
                    });

                };

                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
                function getAvailableOptions() {
                    var organismsListHttp = $http.get('http://www.cise.ufl.edu/~adobra/BioVerto/rest/list/organism-all');
                    $q.all([organismsListHttp]).then(function(results) {
                        var orgNameList = {};
                        var subStructureNameList = {};
                        var rows = d3.csv.parseRows(results[0].data);
                        for (i = 0; i < rows.length; i++)
                        {
                            $scope.availableOrgList.push({name:rows[i][0],fileName:rows[i][1]});
                        }

                    });
                }
                ;
            };
