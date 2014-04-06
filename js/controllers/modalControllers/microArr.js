if (typeof modalControllers === 'undefined')
    modalControllers = {};

modalControllers.microArr = function($scope, $modalInstance) {
    $scope.uploadButtonEnable = true;
    $scope.state = 'uploadState';
    $scope.handleFileSelect = function(element) {
        $scope.file = element.files[0]; // FileList object
    }
   $scope.findNodesGreaterThanThreshold = function (corr_matrix, col, threshold){
       var obj = {};
       for(i=0;i<col;i++){
               for(j=i+1;j<col;j++){
                               
                       if(corr_matrix[i*col+j]>threshold){
                               if(!obj[i])
                                       obj[i]= true;
                               if(!obj[j])
                                       obj[j]= true;
                               
                       }
               }
       }
       return Object.keys(obj).length;
}
$scope.setThreshold = function(threshold)
{
    if($scope.corrResult)
    {
  $scope.numNodes = $scope.findNodesGreaterThanThreshold($scope.corrResult.data,$scope.corrResult.col,threshold);
      //  console.log(Object.keys(nodeObj).length);
   delete nodeObj;
   
    }
}
    $scope.ok = function(graphName) {
        g5.loadGraphFromObjArray($scope.objArr, graphName, $scope.source, $scope.target);
        $modalInstance.close({layout: "force", graphName: graphName});
    };
    var myHeaderCellTemplate = '<div class="ngHeaderSortColumn {{col.headerClass}}"><div>{{col.displayName}} </div>' +
            '<input type="radio" ng-model=\"$parent.$parent.$parent.$parent.source\" value="{{col.displayName}}">  Source <br/>' +
            '<input type="radio" ng-model=\"$parent.$parent.$parent.$parent.target\" value="{{col.displayName}}"> Target <br/></div>';

    $scope.fileUpload = function()
    {
        $scope.uploadButtonEnable = false;
        loadFile($scope.file, function(e) {
            $scope.blob = e.target.result;

             $scope.parsedData = g5.generateObjArray("microArr", e.target.result);
            $scope.previewObjArr = previewData($scope.parsedData.data,$scope.parsedData.row,$scope.parsedData.col);
            $scope.state = 'previewState';
            $scope.$apply();
            $scope.uploadButtonEnable = true;
            $scope.previewColumns = [];

            for (key in $scope.previewObjArr[0])
            {
                var tempObj = {field: key.toString(), displayName: key.toString(), width: "50"};
                $scope.previewColumns.push(tempObj);
            }
        });

    };
    var previewData = function(data_matrix,numRows,numCols)
    {
         var objArr = [];
         var maxRows = 10;
         var maxCols = 10;
         
         var numPreviewRows = (numRows >maxRows ) ? maxRows : numRows;
         var numPreviewCols = (numCols >maxCols ) ?maxCols : numCols;
         
                for (var i = 0; i < numPreviewRows; i++)
                {
                    objArr.push({});
                    for (j = 0; j < numPreviewCols; j++) {
                    objArr[i]["Gene"+j] =data_matrix[i*numCols +j] 
                }
            }
            return objArr;
    };
    $scope.transposeData = function() {

    };
    $scope.calculateCorr = function() {
       $scope.corrResult = findCorrelation($scope.parsedData.data,$scope.parsedData.row,$scope.parsedData.col)
        $scope.corrData = previewData($scope.corrResult.data,$scope.corrResult.col,$scope.corrResult.col);
    };
    function findCorrelation(matrix, row, col) {
        if (row == 0 || col == 0) {
            console.log("No rows or colomns");
            return null;
        }
        console.log("finding correlation");
        var corr_matrix = new Float32Array(col * col);

        get_correlation = Module.cwrap('get_correlation', 'number', ['number', 'number', 'number', 'number']);

        // Get data byte size, allocate memory on Emscripten heap, and get pointer
        var dataBytes = matrix.length * matrix.BYTES_PER_ELEMENT;
        var ptr_matrix = Module._malloc(dataBytes);

        // Copy data to Emscripten heap (directly accessed from Module.HEAPU8)
        var heap_matrix = new Uint8Array(Module.HEAP8.buffer, ptr_matrix, dataBytes);
        heap_matrix.set(new Uint8Array(matrix.buffer));

        var corr_dataBytes = corr_matrix.length * corr_matrix.BYTES_PER_ELEMENT;
        var ptr_corr_matrix = Module._malloc(corr_dataBytes);

        // Copy data to Emscripten heap (directly accessed from Module.HEAPU8)
        var heap_corr_matrix = new Uint8Array(Module.HEAP8.buffer, ptr_corr_matrix, corr_dataBytes);
        heap_corr_matrix.set(new Uint8Array(corr_matrix.buffer));


        //var start = new Date().getTime();
        get_correlation(heap_matrix.byteOffset, heap_corr_matrix.byteOffset, row, col);

        var result_corr = new Float32Array(heap_corr_matrix.buffer, heap_corr_matrix.byteOffset, corr_matrix.length);
        //var end = new Date().getTime();

        //console.log("Time taken: "+(end-start));

        Module._free(heap_matrix.byteOffset);
        Module._free(heap_corr_matrix.byteOffset);

        return {
            data: result_corr,
            col: col
        };
    }
    $scope.previewGridOptions = {enableColumnResize: true, columnDefs: 'previewColumns', data: 'previewObjArr', virtualizationThreshold: 10, enableSorting: false};
 $scope.resultGridOptions = {enableColumnResize: true,  data: 'corrData', virtualizationThreshold: 10, enableSorting: false};

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};