if (typeof modalControllers === 'undefined')
    modalControllers = {};

modalControllers.blast = function($scope, $modalInstance, $http) {
    $scope.uploadButtonEnable = true;
    $scope.state = 'uploadState';
    $scope.graphName = "Blast graph";
    $scope.alertShow = false;
    $scope.alertType = "warning";
    $scope.alertText = ""
    $scope.alertClose = function()
    {

        $scope.alertShow = false;

    }
    
    $scope.handleFileSelect = function(element) {
        $scope.file = element.files[0]; // FileList object
    }
    $scope.ok = function(graphName) {
        g5.loadGraphFromObjArray($scope.results, graphName, "Source", "Target");
        $modalInstance.close({layout: "force", graphName: graphName});
    };
var log10 = function (val) {
  return Math.log(val) / Math.LN10;
}
    $scope.fileUpload = function(evalue, bitscore, pident)
    {
        loadFile($scope.file, function(e) {
            var blob = "";e.target.result;
           if(blob.split(">").length<300)
           {    
            blastFile();
        }
        else
        {
           $scope.alertText = "Files more than 300 sequences not supported"
            $scope.alertShow = true; 
        }
    })
};
var blastFile = function()
{
  var formData = new FormData();

        formData.append('file', $scope.file);
        var p = "";
        if (evalue)
        {
            p += "evalue"
        }
        if (bitscore)
        {
            p += "-bitscore"
        }
        if (pident)
        {
            p += "-pident"
        }
$scope.uploadButtonEnable = false;
$scope.alertText = "Processing  and retrieving results , please wait.."
$scope.alertShow = true;
                
        $http({method: 'POST', url: '/runblast?p=' + p + '&id=' + Math.floor(Math.random() * (10000)), data: formData, headers: {'Content-Type': undefined}, transformRequest: angular.identity})
                .success(function(data, status, headers, config) {
                    $scope.alertShow = false;
            
                    if(!data["err"]){
                    $scope.results = data;
                    var keys = Object.keys( $scope.results[0]);
                    for(var i =0 ;i < keys.length;i++)
                    {
                        attr= keys[i];
                        switch (attr)
                        {
                            case "e" :
                            for(var edges in $scope.results)
                            {   
                                   $scope.results[edges]["log_evalue"]= -1*log10(parseFloat($scope.results[edges][attr]));
                                    delete $scope.results[edges][attr];
                            } 
                            break;
                            case "bs" :
                            for(var edges in $scope.results)
                            {   
                                   $scope.results[edges]["Bitscore"]= parseFloat($scope.results[edges][attr]);
                                    delete $scope.results[edges][attr];
                            } 
                            break;
                            case "p" :
                            for(var edges in $scope.results)
                            {   
                                   $scope.results[edges]["P_ident"]= parseFloat($scope.results[edges][attr]);
                                   delete $scope.results[edges][attr];
                            }
                            break;
                             case "s" :
                            for(var edges in $scope.results)
                            {   
                                   $scope.results[edges]["Source"]=$scope.results[edges][attr];
                                   delete $scope.results[edges][attr];
                            }
                            break;
                            
                             case "t" :
                            for(var edges in $scope.results)
                            {   
                                   $scope.results[edges]["Target"]=$scope.results[edges][attr];
                                   delete $scope.results[edges][attr];
                            }
                            break;
                            default:
                            break;         
                        
                        }
                    }
                        
                       
                        
                    
                    $scope.state = 'previewState';
                    $scope.previewColumns = [];
                   // var map = {s:"Source",t:"Target",bs:"Bitscore",p:"pident",log-evalue:"evalue"};
                    for (key in $scope.results[0])
                    {
                        var tempObj = {field: key.toString(), displayName: key.toString()};
                        $scope.previewColumns.push(tempObj);
                    }
                }
                else
                {
                        alert(data.err);
                }
                })
                .error(function(){
                                             alert("Backend issues");
                            $scope.alertShow = false;
                            $scope.apply();
                });  
}
    $scope.previewGridOptions = {enableColumnResize: true, columnDefs: 'previewColumns', data: 'results', virtualizationThreshold: 10, enableSorting: false};

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};