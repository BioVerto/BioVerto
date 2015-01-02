angular.module("MyApp")
        .directive("filterselect", function(configurationService, componentGenerator, viewProvider, $timeout) {
            return {
                restrict: 'EA',
                templateUrl: "./partials/filterSelect.html",
                 scope: {
                    
                    filterupdate:"&",
                    acessorfns:"=",
                    type:"=",
                    filtervalue:"="
                },
                link: function(scope) {
                    scope.operators = [">", ">=", "===", "<", "<="]
                    scope.rangeMin = 0;
                    scope.rangeMax = 10;
                    scope.filters = [];
                    scope.newOperator = scope.operators[4];
                    scope.step = 1;
                    scope.updateRange = function () {
                        var range = scope.acessorfns[scope.type][scope.newOption].getRange();
                        scope.rangeMin = range.min;
                        scope.rangeMax = range.max;
                        scope.thresVal = range.max;
                        scope.step = 1;//
                        if (isInt(range.max) && isInt(range.min) && (range.max - range.min) > 1) {
                            scope.step = 1;
                        }
                        else {
                            scope.step = Math.abs((parseFloat(range.max) - parseFloat(range.min)) / 100);
                        }
                    };
                    scope.optionChange = function () {
                        if (scope.newOption !== null) {
                            scope.updateRange()
                        }
                        scope.valChanged();
                    }
                    scope.valChanged = function () {
                        if (scope.newOption !== null) {
                            scope.applyFilter($.merge($.merge([], scope.filters), [
                                {name: scope.newOption, fn: scope.acessorfns[scope.type][scope.newOption], operator: scope.newOperator, threshold: scope.thresVal, apply: true}
                            ]));
                        }
                        else {
                            scope.applyFilter(scope.filters);
                        }
                    }
                    scope.applyFilter = function (filters) {
                        filters = filters || scope.filters;
                        var tempArr = [];
                        var argArr = [];
                        var filterStr = "";
                        for (i = 0; i < filters.length ; i++) {
                            if (filters[i].apply)
                            {
                                filterStr += "`" + filters[i].name + "` " + filters[i].operator + " " + filters[i].threshold + " " + "AND ";
                            }
                    }
                        if(filterStr !== ""){
                            filterStr = filterStr.substr(0,filterStr.length -4)
                        }
                        var fn = generateFilterFunction(tempArr);
                        scope.filtervalue = scope.filters;
                        scope.filterupdate({_:filterStr
                        });
                        
                    }
                    scope.addFilter = function()
                    {
                        scope.filters.push({name: scope.newOption, fn: scope.acessorfns[scope.type][scope.newOption], operator: scope.newOperator, threshold: scope.thresVal, apply: true})
                        scope.applyFilter(scope.filters);
                        scope.newOption = "";
                        scope.newOperator="<="
                    }
                    scope.$watch(function(){return scope.filtervalue},function(){
                        scope.filters = scope. filtervalue;
                        scope.applyFilter()
                        }
                    );
                    function isInt(n){
                        return typeof n== "number" &&  n%1===0;
                    }
                }

            };
        });
