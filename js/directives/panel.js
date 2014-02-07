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
                   
                   
                    scope.viewGraph = function(graphname)
                    {
                        scope.graphName = graphname;
                        scope.title = graphname;
                        scope.graph = graphExecutionEngine.getGraph(graphname);
                        scope.refreshView();
                    }
                   
                    scope.colorAcessorGen = function(color)
                    {
                        console.log(color);
                        return function(d)
                        {
                            return color.toString();
                        }
                    }
                    scope.refreshView = function()
                    {
                        if (scope.view)
                        {
                            scope.view.destroy();
                            delete scope.view;
                        }
                        scope.view = viewProvider.getView(scope.layout);
                        scope.view.init("#graphNumber" + scope.index, scope.graph.getData(), 500, 300);


                        var temp = componentGenerator.generateSidebar(configurationService.getConfig(scope.layout));
                        scope.controls = temp;

                    }
                    scope.updateMenu = function() {
                        scope.listGraphs = graphExecutionEngine.listGraphs();

                    }
                    scope.toggleTitle = function() {
                        scope.showTitle = !scope.showTitle;
                    }
//                    if(scope.graphName!==undefined)
//                   {
//                       $timeout(scope.viewGraph(scope.graphName),500) ;
//                   }
                }
            };
        });
