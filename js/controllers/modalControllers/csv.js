 if (typeof  modalControllers === 'undefined')
 modalControllers = {};
 
 modalControllers.csv = function($scope, $modalInstance) {
                $scope.uploadButtonEnable = true;
                $scope.state = 'uploadState';
                $scope.handleFileSelect = function(element) {
                    $scope.file = element.files[0]; // FileList object
                }
                $scope.ok = function(graphName) {
                    g5.loadGraphFromObjArray($scope.objArr, graphName, $scope.source, $scope.target);
                    $modalInstance.close();
                }
                var myHeaderCellTemplate = '<div class="ngHeaderSortColumn {{col.headerClass}}"><div>{{col.displayName}} </div>' +
                        '<input type="radio" ng-model=\"$parent.$parent.$parent.$parent.source\" value="{{col.displayName}}">  Source <br/>' +
                        '<input type="radio" ng-model=\"$parent.$parent.$parent.$parent.target\" value="{{col.displayName}}"> Target <br/></div>';

                $scope.fileUpload = function()
                {
                    $scope.uploadButtonEnable = false;
                    fileLoaderService.loadFile($scope.file, function(e) {
                        $scope.blob = e.target.result;
                        $scope.objArr = g5.generateObjArray("csv", e.target.result);
                        $scope.columns = [];
                        for (key in $scope.objArr[0])
                        {
                            var tempObj = {field: key.toString(), displayName: key.toString(), headerCellTemplate: myHeaderCellTemplate};
                            $scope.columns.push(tempObj);
                        }
                        $scope.state = 'previewState';
                        $scope.$apply();
                        $scope.uploadButtonEnable = true;

                    });

                };

                $scope.gridOptions = {enableColumnResize: true, headerRowHeight: 70, enablePinning: true, data: 'objArr', columnDefs: 'columns', virtualizationThreshold: 10, enableSorting: false, b: 'a'};
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            };