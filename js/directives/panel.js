 angular.module("MyApp")
      .directive("customPanel", function(graphQuery){
    return {
        restrict: "E",
        scope:{
            index:"="
        },
        transclude: true,

        link: function(scope){





        }
    };
});
