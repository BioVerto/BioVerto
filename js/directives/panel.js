angular.module("MyApp")
        .directive("panel", function($http, d3, componentGenerator, graphExecutionEngine,viewProvider, $modal) { //timeout can removed , Its for demo purpose
            return {
                restrict: 'EA',
                scope: {
                    index: "=",
                    layout: "=",
                    title:"="
                },
                templateUrl: "./partials/panel.html",
                transclude: true,
                link: function(scope, element) {
                    scope.title = "New View";
                    scope.showTitle = true;
                    scope.graphName = "";
                    
                    scope.viewGraph = function(graphname)
                    {
                        scope.graphName = graphname;
                        scope.title = graphname;
                        scope.graph = graphExecutionEngine.getGraph(graphname);
                        scope.refreshView();
                    }
                    scope.refreshView = function()
                    {
                        if(scope.view)
                        {
                         scope.view.destroy();
                         delete scope.view ;
                        }
                       scope.view = viewProvider.getView(scope.layout);
                       scope.view.init("#graphNumber"+scope.index,scope.graph.getData(),500,300);
                      // componentGenerator.generateSidebar(scope.view.listControls());
                    }
                    scope.updateMenu = function() {
                        scope.listGraphs = graphExecutionEngine.listGraphs();

                    }
                    scope.toggleTitle = function() {
                        scope.showTitle = !scope.showTitle;
                    }
                }
            };
        });
