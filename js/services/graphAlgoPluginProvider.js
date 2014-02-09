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
                var randomNumber = function () {
                    return Math.floor(Math.random() * (9)) + 1;
                };
                var f = "randomData";
                g.addNodeAccessor("randomData","number", g.createAccessor(f));
                for (i in g.nodes) {
                    var node = g.nodes[i];
                    node.data[f] = randomNumber();
                }
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