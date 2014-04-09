if (typeof modalControllers === 'undefined')
    modalControllers = {};

modalControllers.blast = function($scope, $modalInstance,$http) {
    $scope.uploadButtonEnable = true;
    $scope.state = 'uploadState';
    $scope.graphName = "Blast graph";
   
    $scope.handleFileSelect = function(element) {
        $scope.file = element.files[0]; // FileList object
    }
    $scope.ok = function(graphName) {
        g5.loadGraphFromObjArray($scope.results, graphName,"s","t");
        $modalInstance.close({layout: "force", graphName: graphName});
    };
    
    $scope.fileUpload = function(evalue,bitscore,pident)
    {
            var formData = new FormData();
		
	        formData.append('file', $scope.file);
                formData.append('id', Math.floor(Math.random() * (10000)));
                var p ="";
                if(evalue)
                {
                    p+="evalue"
                }
                if(bitscore)
                {
                    p+="-bitscore"
                }  
                if(pident)
                {
                    p+="-pident"
                }  
                formData.append('p',p);
		$http({method: 'POST', url: '/runblast', data: formData, headers: {'Content-Type': undefined}, transformRequest: angular.identity})
		.success(function(data, status, headers, config) {
                       $scope.results = data.data;
                       $scope.state = 'previewState';
                      
		});
            

    };

    $scope.previewGridOptions = {enableColumnResize: true, columnDefs: 'previewColumns', data: 'results', virtualizationThreshold: 10, enableSorting: false};
 
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};