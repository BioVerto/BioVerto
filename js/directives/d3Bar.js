angular.module("MyApp")
    .directive("d3bar", function($timeout,d3,graphQuery,componentGenerator){ //timeout can removed , Its for demo purpose
        return {
            restrict: 'EA',
            scope: {
                index: "="

            },
            templateUrl:"./partials/chartA.html",
            transclude:true,
            link: function(scope, element) {
              //select element
                var svg = d3.select(angular.element(element.find("#chart"))[0])
               //d3 scaling
                var colorScale = d3.scale.linear()
                    .domain([0, 100])
                    .range(["#add8e6", "blue"]);
                var barWidth = 5
                svg.attr('height', 400);
                // watch for data changes and re-render
                scope.$watch('data', function(newVals, oldVals) {
                    return scope.render();
                }, true);

                //D3 related code
                scope.insertNewData = function(){
                    svg.selectAll("div.h-bar")
                        .data(scope.data)
                        .enter().append("div")
                        .attr("class", "h-bar")
                        .append("span");
                }

                scope.removeElements = function(){
                    svg.selectAll("div.h-bar")
                        .data(scope.data)
                        .exit().remove();
                }

                scope.updateElementStyle = function(style,fn){
                    svg.selectAll("div.h-bar")
                        .data(scope.data)
                        .attr("class", "h-bar")
                        .style(style,fn)

                }

                scope.render = function(){
                    scope.insertNewData();
                    scope.removeElements();
                    scope.updateElementStyle("width",function (d) {
                        return (d.width * barWidth) + "px";
                    });
                    scope.updateElementStyle("background-color",function (d) {
                        return colorScale(d.color);
                    });
                };
               //Adding random data to graph
                scope.genFlg = false;
                var addRandomData = function ()
                {
                    $timeout(addRandomData,1000);
                    if(scope.genFlg)
                    {
                        scope.data.shift();
                        scope.data.push({width: scope.randomValue(), color: scope.randomValue()});
                    }
                }
                $timeout(addRandomData,1000);

                scope.randomValue= function () {
                    return Math.round(Math.random() * 100);
                }

                //Query for left panel and generate components
                var controlsObj = [{type:"bool",name:"P1",property:"generate-bars",label:"Generate Bars",func:"genBars"},
                                    {type:"range", name:"P2",  property:"width-range" ,label:"Width Range",func:"widthRange",min:0,max:10,default:5},
                                    {type:"select",name:"P3",property:"color",label:"Color",func:"color",options:[{value:"red",label:"Red"},{value:"green",label:"Green"},{value:"blue",label:"Blue"}]},
             ];
                scope.controls =  componentGenerator.genControls(controlsObj);
                //Query for graph data
                scope.data = graphQuery.getGraphData();
                //action on value change
                scope.genBars  = function  (value) {
                    if(!arguments)return scope.genFlg;

                      scope.genFlg = value;  
                }
                scope.widthRange = function  (value) {
                    
                   if(!arguments)return barWidth;

                        barWidth = value;
                        scope.updateElementStyle("width",function (d) {
                            return (d.width * barWidth) + "px";
                        }); 
                }
                
                scope.color = function  (value) {
                    if(!arguments)return colorScale;    
                    colorScale = d3.scale.linear()
                            .domain([0, 100])
                            .range(["#add8e6", value]);
                        scope.updateElementStyle("background-color",function (d) {
                            return colorScale(d.color);
                        });
                }
                
               

            }
        };
    });
