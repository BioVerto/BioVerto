angular.module("MyApp")
        .directive("filterselect", function(configurationService, componentGenerator, viewProvider, $timeout) {
            return {
                restrict: 'EA',
                templateUrl: "./partials/filterSelect.html",
                link: function(scope) {
                    scope.operators = [">", ">=", "===", "<", "<="]
                    scope.rangeMin = 0;
                    scope.rangeMax = 10;
                    scope.filters = [];
                    scope.newOperator=scope.operators[4];
                    scope.updateRange = function()
                    {
                        var range = d3.extent(scope.view.nodeData(), function(d) {
                            return scope.acessorFns['Node'][scope.newOption](d.data);
                        });
                        scope.rangeMin = range[0];
                        scope.rangeMax = range[1];
                        scope.thresVal = range[1];
                    };
                    scope.optionChange = function()
                    {
                        if(scope.newOption!==null){scope.updateRange()}
                        scope.valChanged();
                    }
                    scope.valChanged = function()
                    {
                         if(scope.newOption!==null)
                        {
                         scope.applyFilter($.merge($.merge([],scope.filters),[{name: scope.newOption, fn: scope.acessorFns['Node'][scope.newOption], operator: scope.newOperator, threshold: scope.thresVal, apply: true}]));
                       }
                       else
                       {
                           scope.applyFilter(scope.filters);
                       }
                    }
                    scope.applyFilter = function(filters)
                    {
                        filters = filters||scope.filters;
                        var tempArr = [];
                        var argArr = [];
                        for (i = 0; i <filters.length; i++) {
                            if (filters[i].apply)
                            {
                                tempArr.push(filters[i]["operator"]);
                                tempArr.push(filters[i]["threshold"]);
                                argArr.push(filters[i]["fn"])
                                
                            }
                        }
                        var fn = generateFilterFunction(tempArr);
                        scope.view.filterFunction(function(d) {
                            return fn.apply(this, argArr.concat(d.data));
                        });
                        
                    }
                    scope.addFilter = function()
                    {
                        scope.filters.push({name: scope.newOption, fn: scope.acessorFns['Node'][scope.newOption], operator: scope.newOperator, threshold: scope.thresVal, apply: true})
                        scope.applyFilter(scope.filters);
                        scope.newOption = "";
                        scope.newOperator="<="
                    }
                }

            };
        });
