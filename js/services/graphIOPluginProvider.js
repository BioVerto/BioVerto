angular.module("MyApp")
    .service('graphIOPluginProvider', function(graphProvider,d3){
var csvPlugin = function(g5,blob){
            return d3.csv.parse(blob);
            }
 this.getPlugin = function (plugin){
                switch (plugin)
                {
                    case "csv":
                        return csvPlugin;
                }
 }
 
});