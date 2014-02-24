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
                    scope.updateRange = function()
                    {
                        var range = d3.extent(scope.view.nodeData(), function(d) {
                            return scope.acessorFns['Node'][scope.newOption](d.data);
                        });
                        scope.rangeMin = range[0];
                        scope.rangeMax = range[1];
                        scope.thresVal = range[1];
                    };
                    scope.valChanged = function()
                    {

                    }
                    scope.applyFilter = function()
                    {
                        var tempArr = [];
                        var argArr = [];
                        for (i = 0; i < scope.filters.length; i++) {
                            if (scope.filters[i].apply)
                            {
                                tempArr.push(scope.filters[i]["operator"]);
                                tempArr.push(scope.filters[i]["threshold"]);
                                argArr.push(scope.filters[i]["fn"])
                            }
                        }
                        var fn = generateFilterFunction(tempArr);
                        scope.view.filterFunction(function(d) {
                            // console.log(fn); 
                            return fn.apply(this, argArr.concat(d.data));
                        });

                    }
                    scope.addFilter = function()
                    {
                        scope.filters.push({name: scope.newOption, fn: scope.acessorFns['Node'][scope.newOption], operator: scope.newOperator, threshold: scope.thresVal, apply: true})
                        scope.applyFilter();
                    }
                }

            };
        });
