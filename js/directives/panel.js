angular.module("MyApp")
        .directive("panel", function(configurationService, componentGenerator, viewProvider, $timeout) {
            return {
                restrict: 'EA',
                scope: {
                    index: "=",
                    layout: "=",
                    heading: "=",
                    activeindex: "=",
                    graphName: "=",
                    state:"=",
                    rootfn:"&"
                   
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
                    scope.acessorFns={};
                    scope.view = {};
                    scope.runAlgo = function(name)
                    {
                        scope.alertBox("Runnning Algorithm","warning");
                        scope.alertBox("Algorithm Complete","success");
                        g5.applyAlgorithm(g5.getGraph(scope.graphName), name);
                        scope.refreshSidebar();
                    }
                    scope.highlightNode = function(nodenum)
                    {
                       // scope.view.highlightNode(nodenum);
                       scope.view.filterFunction(function(d,i){return true;});//function(d,i){console.log(d);console.log(d.index===1||d.index===0);return d.index===1||d.index===0;});
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
                        var config = jQuery.extend(true, [], configurationService.getConfig(scope.layout));
                        if(scope.state!==undefined)
                        {
                            for(i=0;i<config.length;i++)
                            {    
                                config[i].default = scope.state.config["P"+i];
                            }
                           
                        }
                         scope.controls = componentGenerator.generateSidebar(config, scope.acessorFns);//,graphExecutionEngine.listNodeAccessors(scope.graphName),graphExecutionEngine.EdgeAccessors());
                        
                        if(scope.state!==undefined)
                        {
                             $timeout(scope.resumeState,0) ;
                        }   
                    };
                    
                    scope.resumeState = function()
                    { 
                        var state = scope.state;
                         scope.view.resumeState(state.viewState );
                         var filterscope = scope.$$childHead.$$nextSibling.$$nextSibling.$$nextSibling;
                            filterscope.filters = state.filters;
                            filterscope.applyFilter();
                    }
                    scope.removeView = function()
                    {
                        scope.rootfn({fntype:"removeView",args:scope.index});  
                    }
                    scope.cloneView = function()
                    {
                         scope.rootfn({fntype:"cloneView",args:scope.getState()});
                        
                    }
                    scope.saveView = function()
                    {
                         scope.rootfn({fntype:"saveView",args:scope.getState()});
                        
                    }
                     scope.exportView = function()
                    {
                     var canvas, xml;
                     canvas = document.createElement("canvas");
                     canvas.className = "screenShotTempCanvas";
                    //convert SVG into a XML string
                     xml = (new XMLSerializer()).serializeToString($("#graphNumber" + scope.index).find('svg')[0]);
                    // Removing the name space as IE throws an error
                    xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');
                    //draw the SVG onto a canvas
                    canvg(canvas, xml);
                       window.open(canvas.toDataURL('image/png')); 
                    }
                    scope.getState = function()
                    {
                       var panelscope = scope.$$childHead.$$nextSibling.$$nextSibling.$$nextSibling.$$childHead.$$nextSibling.$$nextSibling.$$nextSibling;
                         var filterscope = scope.$$childHead.$$nextSibling.$$nextSibling.$$nextSibling;
                            var numOptions = configurationService.getConfig(scope.layout).length;
                           var config = {}
                            for(i = 0 ; i <numOptions;i++)
                            {
                               config["P"+i] =  panelscope["P"+i]
                            }
                            return {layout:scope.layout,graphName:scope.graphName,config:config,filters:filterscope.filters,viewState:scope.view.getState()}
                           
                    }
                    scope.filterFunction=function()
                    {
                        
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
