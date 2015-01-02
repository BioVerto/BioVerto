if (typeof modalControllers === 'undefined')
    modalControllers = {};

modalControllers.runAlgo = function($scope,$modalInstance, $http, graph,componentGenerator) {
    $scope.graph= graph;
    (function (){
        $http.get("/listAlgos").success(function (result) {
            $scope.algoConfigs = {};
            for(i in result){
                $scope.algoConfigs[i] = componentGenerator.generateSidebar(result[i],{});

//                var el = $compile($scope.algoConfig[i])($scope);
//                $element.find("#algos").append(el);
            }
        });
    })();

};