if (typeof modalControllers === 'undefined')
    modalControllers = {};

modalControllers.blast = function($scope, $modalInstance,$http) {
    $scope.uploadButtonEnable = true;
    $scope.state = 'uploadState';
    $scope.handleFileSelect = function(element) {
        $scope.file = element.files[0]; // FileList object
    }
    $scope.ok = function(graphName) {
        g5.loadGraphFromObjArray($scope.objArr, graphName, $scope.source, $scope.target);
        $modalInstance.close({layout: "force", graphName: graphName});
    };
    
    $scope.fileUpload = function()
    {
            var formData = new FormData();
		
	        formData.append('file', $scope.file);
                formData.append('id','2');
                formData.append('p','evalue');
                
                
		console.log(formData);
		$http({method: 'POST', url: '/runblast', data: formData, headers: {'Content-Type': undefined}, transformRequest: angular.identity})
		.success(function(data, status, headers, config) {
                        console.log(data);
                        console.log(status);
                        console.log(headers);
                        console.log(config);
                
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