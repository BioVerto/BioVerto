angular.module("MyApp")
        .directive("panel", function(configurationService, componentGenerator, graphExecutionEngine, viewProvider,$timeout) {
            return {
                restrict: 'EA',
                scope: {
                    index: "=",
                    layout: "=",
                    title: "@",
                    graphName: "="
                },
                templateUrl: "./partials/panel.html",
                transclude: true,
                link: function(scope, element) {
                    scope.title = "New View";
                    scope.showTitle = true;
                   
                   
                    scope.viewGraph = function(graphName)
                    {
                        if (arguments.length)
                        {
                           scope.graphName = graphName; 
                        }
                        scope.title = scope.graphName;
                        scope.graph = graphExecutionEngine.getGraph(scope.graphName);
                        scope.refreshView();
                    }
                   
                    scope.colorAcessorGen = function(color)
                    {
                      
                        return function(d)
                        {
                            return color.toString();
                        }
                    }
                    
                    scope.setValue = function(option, value){
                        // Safely set the value if the view has the option
                        if (scope.view[option])
                            scope.view[option](value);
                        // TODO: add an else with a coding error
                           
                    }
                    
                    scope.refreshView = function()
                    {
                        if (scope.view!==undefined)
                        {
                            scope.view.destroy();
                            delete scope.view;
                        }
                        scope.view = viewProvider.getView(scope.layout);
                        scope.view.init("#graphNumber" + scope.index, scope.graph.getData(), 500, 300);
                        var acessorFns = {Node:graphExecutionEngine.listNodeAccessors(scope.graphName),Edge:graphExecutionEngine.listEdgeAccessors(scope.graphName)};
                        var temp = componentGenerator.generateSidebar(configurationService.getConfig(scope.layout),acessorFns);//,graphExecutionEngine.listNodeAccessors(scope.graphName),graphExecutionEngine.EdgeAccessors());
                        scope.controls = temp;

                    }
                    scope.updateMenu = function() {
                        scope.listGraphs = graphExecutionEngine.listGraphs();

                    }
                    scope.toggleTitle = function() {
                        scope.showTitle = !scope.showTitle;
                    }
                    if(scope.graphName)
                   {
                      $timeout(scope.viewGraph,0);
                   }
                }
            };
        });
