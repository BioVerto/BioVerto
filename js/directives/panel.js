angular.module("MyApp")
        .directive("panel", function(configurationService, componentGenerator, viewProvider, $timeout) {
            return {
                restrict: 'EA',
                scope: {
                    index: "=",
                    layout: "=",
                    heading: "=",
                    activeindex: "=",
                    graphName: "="
                },
                templateUrl: "./partials/panel.html",
                transclude: true,
                link: function(scope, element) {
                    scope.width = 594;
                    scope.height = 360;
                    scope.alertShow = false;
                    scope.alertText = "";
                    scope.alertType = "info";
                    scope.algorithmList = g5.listAlgorithms();
                    scope.runAlgo = function(name)
                    {
                        scope.alertBox("Runnning Algorithm","warning");
                        scope.alertBox("Algorithm Complete","success");
                        g5.applyAlgorithm(g5.getGraph(scope.graphName), name);
                        scope.refreshSidebar();
                    }
                    scope.highlightNode = function(nodenum)
                    {
                        scope.view.highlightNode(nodenum);
                    }
                    scope.refreshSidebar = function()
                    {
                        scope.acessorFns = {Node: scope.graph.listNodeAccessors(), Edge: scope.graph.listEdgeAccessors()};
                        
                    }
                    scope.viewGraph = function(graphName)
                    {
                        if (arguments.length)
                        {
                            scope.graphName = graphName;
                        }
                        scope.heading = scope.graphName;
                        scope.graph = g5.getGraph(scope.graphName);
                        scope.view = viewProvider.getView(scope.layout);
                        scope.view.init("#graphNumber" + scope.index, scope.graph.getData(), scope.width, scope.height);
                        scope.refreshSidebar();
                        scope.controls = componentGenerator.generateSidebar(configurationService.getConfig(scope.layout), scope.acessorFns);//,graphExecutionEngine.listNodeAccessors(scope.graphName),graphExecutionEngine.EdgeAccessors());
                       
                    }
                    scope.cloneView = function()
                    {
                        console.log("ToDo Clone")
                    }
                    scope.removeView = function()
                    {
                        scope.$parent.$parent.removeView(scope.index);
                       
                    }
                    scope.colorAcessorGen = function(color)
                    {

                        return function(d)
                        {
                            return color.toString();
                        }
                    }

                    scope.setNumber = function(option, value) {
                        // Safely set the value if the view has the option
                        if (scope.view[option])
                            scope.view[option](+value);
                        // TODO: add an else with a coding error

                    }
                    scope.getAcessorFunction = function(tab, name)
                    {
                        var temp = scope.acessorFns[tab][name];
                        return temp;
                    }

                   
                    scope.setActive = function() {
                        scope.$parent.$parent.active = scope.index;
                    };
                    scope.resize = function(width, height)
                    {
                        scope.width = width - 6;
                        scope.height = height - 30;
                        scope.view.resize(width - 6, height - 30);
                    }
                    scope.alertClose = function()
                    {
                        console.log("closing")
                        scope.alertShow = false;

                    }
                    scope.alertBox = function(message, type) {
                        scope.alertShow = true;
                        scope.alertText = message;
                        scope.alertType = type;
                    }
                    scope.$watch('$parent.$parent.active',function()
                    {
                        if(scope.activeindex === scope.index)
                        {
                          
                            $timeout(function(){bringFront($(element).find(".viewWindow"), '.viewWindow')},0);
                        }
                    });
                    if (scope.graphName)
                    {
                        // now visualize the graph
                        $timeout(scope.viewGraph, 0);
                         bringFront($(this), '.viewWindow');
                    }
                    // This is necessary since the DOM element is not build until latter
                    // we need to postpone any activity that manipulates the DOM
                    $timeout(function() {
                        // make the view window resizable and draggable
                        var _DOM = $(element).find(".viewWindow");

                        $(_DOM).resizable({autoHide: true, // containment: [320, 120, 2000, 1500],
                            handles: "se,e,s", grid: [10, 10],
                            minWidth: 300, minHeight: 300,
                            resize: function(event, ui) {
                                if (scope.resize)
                                    scope.resize(ui.size.width, ui.size.height);
                                scope.$broadcast('RESIZE', ui.size.width, ui.size.height);
                            }
                        })
                                .draggable({containment: [320, 84, 2000, 1500], handle: ".panel-title", stack: ".viewWindow", grid: [1, 1]})
                                .bind('click', function(event) {
                                    bringFront($(this), '.viewWindow');
                                    event.stopPropagation();
                                });

                        // bring this window to front so it is immediatelly visible                                                                                                                                                
                        bringFront(_DOM, '.viewWindow');
                        scope.setActive();
                    }, 0);

                }
            };
        });
