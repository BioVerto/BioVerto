angular.module("MyApp")
        .service('graphAlgoPluginProvider', function() {
            var outDegree = function(g) {
                var f = "outDegree";
                g.addNodeAccessor("outDegree", "number",g.createAccessor(f));
                for (i in g.nodes) {
                    var node = g.nodes[i];
                    node.data[f] = node.edges.length;
                }
            };
            var randomDataNode = function(g)
            {
               
            }
            this.getAlgo = function(algo) {
                switch (algo)
                {
                    case "outDegree":
                        return outDegree;
                        break;
                    case "randomDataNode":
                         return randomDataNode;
                        break;
                }
            }
            this.listAlgo = function()
            {
                return  ["outDegree" ,"randomDataNode"];
            }

        });