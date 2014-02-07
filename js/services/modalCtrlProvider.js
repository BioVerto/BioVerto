angular.module("MyApp")
        .service('modalCtrlProvider', function(graphExecutionEngine, fileLoaderService) {
            var mintCtrl = function($scope, $modalInstance, $http, d3, $q) {
    $scope.availableOrgList = []
    $scope.uploadButtonEnable = true;
    $scope.state = 'uploadState';
    $scope.selectedOrgName = "";
    getAvailableOptions();
    
    $scope.pathwayUpload = function(selectedPathway)
    {
        $scope.uploadButtonEnable = false;
        $http.get("http://www.cise.ufl.edu/~adobra/BioVerto/MINT/"+selectedPathway.fileName).success(function(result){
            $scope.blob = "Source\tTarget\tValue\n"+result;
            graphExecutionEngine.loadGraphFromFile("mint", $scope.blob,selectedPathway.longName+" - " +selectedPathway.subStructureName, "Source", "Target");
            $modalInstance.close({layout:"force",graphName:selectedPathway.longName+" - " +selectedPathway.subStructureName});
        });
    
    };

     $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    function getAvailableOptions(){
    var organismsListHttp = $http.get('http://www.cise.ufl.edu/~adobra/BioVerto/rest/list/organism'),
            pathwayListHttp = $http.get("http://www.cise.ufl.edu/~adobra/BioVerto/rest/list/pathway"),
            fileListHttp = $http.get("http://www.cise.ufl.edu/~adobra/BioVerto/MINT/list.txt");
    $q.all([organismsListHttp, pathwayListHttp, fileListHttp]).then(function(results) {
    var orgNameList = {};
    var subStructureNameList = {};

        var rows = results[0].data.split('\n');
        for (i = 0; i < rows.length; i++) {
            var tabloc = rows[i].indexOf('\t', 7);
            var PEnd = rows[i].indexOf('Prokaryotes');
            var EEnd = rows[i].indexOf('Eukaryotes');
            var nameEnd = (PEnd !== -1 ? PEnd : EEnd);
            orgNameList[rows[i].substring(7, tabloc)] = rows[i].substring(tabloc + 1, nameEnd);           
        }
        rows = results[1].data.split('\n');
        for (i = 0; i < rows.length; i++) {
          subStructureNameList[rows[i].substring(8, 13)] = rows[i].substring(14, rows[i].length);
        }
        rows = d3.csv.parseRows(results[2].data);
        for (i = 0; i < rows.length; i++) {
                $scope.availableOrgList.push({
                shortName: rows[i][0],
                longName:orgNameList[rows[i][0]],
                id: rows[i][1],
                subStructureName: subStructureNameList[rows[i][1]],
                fileName:rows[i][0]+"_"+rows[i][1]+".graph"
            });
        }
    })};
};
                var csvCtrl = function($scope, $modalInstance) {
                $scope.uploadButtonEnable = true;
                $scope.state = 'uploadState';
                $scope.handleFileSelect = function(element) {
                    $scope.file = element.files[0]; // FileList object
                }
                $scope.ok = function(graphName) {
                    graphExecutionEngine.loadGraphFromObjArray($scope.objArr, graphName, $scope.source, $scope.target);
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
                        $scope.objArr = graphExecutionEngine.generateObjArray("csv", e.target.result);
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
            this.getCtrl = function(type)
            {
                switch (type)
                {
                    case 'csv':
                        return csvCtrl;
                    case 'MINT':
                        return mintCtrl;
                }
            }
        });

