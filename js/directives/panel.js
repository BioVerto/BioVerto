angular.module("MyApp")
        .directive("panel", function(configurationService, componentGenerator, graphExecutionEngine, viewProvider,$timeout) {
            return {
                restrict: 'EA',
                scope: {
                    index: "=",
                    layout: "=",
                    title: "@",
                    activeindex: "=",
                    graphName: "="
                },
                templateUrl: "./partials/panel.html",
                transclude: true,
                link: function(scope, element) {
                    scope.title = "New View";
                    scope.showTitle = true;
                    scope.width = 580;
                    scope.height = 330;
                    scope.title = "";
                   
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
                   scope.removeView = function()
                   {
                       console.log("here")
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
                        scope.view.init("#graphNumber" + scope.index, scope.graph.getData(), scope.width, scope.height);
                        scope.acessorFns = {Node:graphExecutionEngine.listNodeAccessors(scope.graphName),Edge:graphExecutionEngine.listEdgeAccessors(scope.graphName)};
                        scope.controls = componentGenerator.generateSidebar(configurationService.getConfig(scope.layout),scope.acessorFns);//,graphExecutionEngine.listNodeAccessors(scope.graphName),graphExecutionEngine.EdgeAccessors());
 
                    };
                    scope.getAcessorFunction = function(tab,name)
                    {
                        var temp = scope.acessorFns[tab][name];
                        return temp;
                    }

                    scope.updateMenu = function() {
                        scope.listGraphs = graphExecutionEngine.listGraphs();

                    };
                    scope.toggleTitle = function() {
                        scope.showTitle = !scope.showTitle;
                    };
                    scope.setActive = function(){  
                        console.log("set Active");
                        scope.$parent.$parent.active = scope.index;
                    };
                    scope.resize = function(width,height)
                    {
                        scope.width = width-20;
                        scope.height = height-60;
                        scope.view.resize(width-20,height-60);
                    }
                    if(scope.graphName)
                    {
                        // This is necessary since the DOM element is not build until latter
                        // we need to postpone any activity that manipulates the DOM
                        $timeout(function(){
                            // make the view window resizable and draggable
                            var _DOM = $(element).find(".viewWindow");
                            
                            $(_DOM).resizable({ autoHide: true, // containment: [320, 120, 2000, 1500],
                                handles: "se,e,s", grid: [10, 10],
                                minWidth: 300, minHeight: 300,
                                resize: function(event, ui){
                                    if (scope.resize)
                                        scope.resize(ui.size.width, ui.size.height);
                                    scope.$broadcast('RESIZE', ui.size.width, ui.size.height);
                                }
                            })
                                    .draggable({ containment: [320, 120, 2000, 1500], handle: ".panel-title", stack: ".viewWindow", grid: [1, 1] })
                                    .bind('click',function(event){ bringFront($(this), '.tableViz'); event.stopPropagation();});
                            
                            // bring this window to front so it is immediatelly visible                                                                                                                                                
                            bringFront(_DOM, '.viewWindow');
                            scope.setActive();
                            
                            // now visualize the graph
                            scope.viewGraph();   
                        },0);
                    }
                }
            };
        });
