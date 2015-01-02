//https://groups.google.com/forum/#!searchin/angular/ng-model/angular/mkhW57FC0xE/Cn-y_WFvJhUJ
angular.module("MyApp")
        .directive("panel", function(configurationService, componentGenerator, viewProvider, $timeout,$compile,$modal,modalCtrlProvider) {
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

                link: function(scope, element) {
                    scope.width = 594;
                    scope.height = 360;
                    scope.alertShow = false;
                    scope.alertText = "";
                    scope.alertType = "info";
                    scope.algorithmList = g5.listAlgorithms();
                    scope.acessorFns={};
                    scope.view = {};
                    scope.imageData ="";
                    scope.filters ={edge:[],node:[]};
                    scope.data = {};
                    for(var i =0 ; i<20;i++){
                        scope["P"+i] = "";
                    }
                    scope.refreshSidebar = function()
                    {
                        scope.acessorFns = {Node: scope.graph.listNodeAccessors(), Edge: scope.graph.listEdgeAccessors()};
                        
                    }

                    scope.removeView = function()
                    {
                        scope.view.destroy();
                        scope.rootfn({fntype:"removeView",args:scope.index});  
                    }

                    scope.cloneView = function()
                    {
                         scope.rootfn({fntype:"cloneView",args:scope.getState()});
                        
                    }

                    scope.stopAnimationView = function()
                    {
                         scope.view.stopAnimation();
                        
                    }
                    
                    scope.saveView = function()
                    {
                         scope.rootfn({fntype:"saveView",args:scope.getState()});
                        
                    }

                     scope.exportAsImage = function()
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
                      scope.imageData = canvas.toDataURL('image/png'); 
                    }

                    scope.getState = function()
                    {
                       var nodeFilterscope = scope.filters.node;
                       var edgeFilterscope = scope.filters.edge;
                          
                           var config = _.clone(scope.data);
                           return {layout:scope.layout,graphName:scope.graphName,config:config,edgefilters:scope.filters.edge,nodefilters:scope.filters.node,viewState:scope.view.getState()}
                    }

                    scope.resumeState = function()
                    {
                        var state = scope.state;
                        scope.view.resumeState(state.viewState );




                    }

                    scope.runAlgo = function(name)
                    {
                        var modalInstance = $modal.open({
                            templateUrl: './partials/runAlgo.html',
                            controller: modalCtrlProvider.getCtrl("runAlgo"),
                            resolve: {
                                graph:function(){
                                    return scope.graph;
                                }
                            }
                        });
                        modalInstance.result.then(function(){
                            scope.refreshSidebar();
                        })

                    }

                    scope.alertClose = function()
                    {
                        scope.alertShow = false;
                    }

                    scope.alertBox = function(message, type) {
                        scope.alertShow = true;
                        scope.alertText = message;
                        scope.alertType = type;
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

                    scope.setNumber = function(option, value) {
                        // Safely set the value if the view has the option
                        if (scope.view[option])
                            scope.view[option](+value);
                    }
                    var modalfn = function(id) {
                        var modalInstance = $modal.open({
                            templateUrl: './partials/uniprotData.html',
                            controller: modalCtrlProvider.getCtrl("uniprot"),
                            resolve: {
                                id:function(){
                                    return id;
                                }
                            }
                        });

                    }

                    var init = function(graphName)
                    {

                        if (graphName)
                        {
                            scope.graphName = graphName;
                        }
                        scope.heading = scope.graphName;
                        scope.graph = g5.getGraph(scope.graphName);
                        scope.view = viewProvider.getView(scope.layout);
                        scope.view.init("#graphNumber" + scope.index, scope.graph, scope.width, scope.height,undefined,modalfn);
                        scope.refreshSidebar();

                        //resume state related stuff
                        var config = jQuery.extend(true, [], configurationService.getConfig(scope.layout));
                        if(scope.state)
                            {
                                for(i=0;i<config.length;i++)
                                {
                                    if(scope.state.config["P"+i]){
                                        config[i].default = scope.state.config["P"+i];
                                     }
                                }
                                scope.filters.edge = scope.state.edgefilters;
                                scope.filters.node = scope.state.nodefilters;
                            }
                        scope.controls = componentGenerator.generateSidebar(config, scope.acessorFns);
                        var el = $compile(scope.controls )(scope);
                        element.find("#properties").append(el);


                        if(scope.state!==undefined)
                        {
                            $timeout(scope.resumeState,0) ;
                        }

                    };


                    // This is necessary since the DOM element is not build until latter
                    // we need to postpone any activity that manipulates the DOM
                    $timeout(function() {

                       init();

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
                        $("#dropdown"+scope.index).find('form').click(function (e) {
                                e.stopPropagation();
                                 });
                   }, 0);

                }
            };
        });
