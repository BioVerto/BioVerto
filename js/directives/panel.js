angular.module("MyApp")
    .directive("panel", function($timeout,d3,graphQuery,componentGenerator){ //timeout can removed , Its for demo purpose
        return {
            restrict: 'EA',
            scope: {
                index: "="

            },
            templateUrl:"./partials/chartA.html",
            transclude:true,
            link: function(scope, element) {
               

            }
        };
    });
