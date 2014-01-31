angular.module("MyApp")
    .service('graphIOPluginProvider', function(graphProvider,d3){
var csvPlugin = function(g5,blob, source, target){
            source = source || "source";
            target = target || "target";
            var graph = graphProvider.createGraph();
            var data = d3.csv.parse(blob);
                data.forEach(function(d){
                   // assuming that source and target columns are defined
                  
                    var s = d[source];
                    delete d[source];
                    var t = d[target];
                    delete d[target];
                    graph.addEdge(s, t, d);
                  
                 });
                // select the first element and add accessor functions for mebers
                var el = data[0] || {};
                
                for (v in el){
                    g5.addEdgeAccessor(v, g5.createAccessor(v));
                }

            return graph;
            }
 this.getPlugin = function (plugin){
                switch (plugin)
                {
                    case "csv":
                        return csvPlugin;
                }
 }
 
});