/* 15-FEB-2014 @Author Parag
 Returns Closeness Centrality for all vertices of the given graph.
 Calculates single source shortest path to other vertices and sums the distances(this is farness).
 Its inverse is the closeness for that node.
 More central a node in a graph, lesser would be its sum of distances to other nodes and hence higher would be its closeness value. 
 Tested on -
 test.csv, test2.csv
 Mint full networks - Pisum sativum
 */
(function(g5) {
	
    var closeness = function bellman_ford(g, source) { // calculates single source shortest path for given source node
		
		var nodes = g.listNodes();
		var edges = g.listEdges();
		var INF = 4294967295;
		
		//console.log("Length" +nodes.length);
		for (var n in nodes)
			nodes[n].data.distance = INF;
		
		source.data.distance = 0;

		//Initially, all distances are infinite and all predecessors are null
			
		for (var i = 1; i < nodes.length; i++){
			
			for (var e in g.edges) {
				//console.log("Edge id " +e);
				var edge = g.edges[e];
				//console.log(edge.source.data.distance + "\t" + edge.weight  + "\t" + edge.target.data.distance);
				 if(edge.source.data.distance + edge.weight < edge.target.data.distance) {
					//console.log("Relax edge between " + edge.source.id + " and " + edge.target.id + ".");
					edge.target.data.distance = edge.source.data.distance + edge.weight;
					edge.target.data.predecessor = edge.source.data.id;
				}
				
				if(!edge.directed) {
					if(edge.target.data.distance + edge.weight < edge.source.data.distance) {
						//console.log("Not directed" + "Relax edge between "+edge.target.data.id+" and "+edge.source.data.id+".");
						edge.source.data.distance = edge.target.data.distance + edge.weight;
						edge.source.data.predecessor = edge.target.data.id;	
					}
				}		
			}
		}
		
		var sum = 0.0;
		//console.log("Distance cal." + source);
		for (j in nodes) {
			//console.log(nodes[j].data.distance);
			if(nodes[j].data.distance<4294967295)sum += (nodes[j].data.distance);
		}
		var closeness = roundToTwo(1/(sum));
		//console.log(source.id + " " + sum);
		return closeness;
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+4")  + "e-4");
}

    var f = g5.newField();
    g5.addAlgoPlugin({
        name: "Closeness Centrality",
        algo: function(g) {
            
            for (j in g.nodes) {
                var node = g.nodes[j];
                node.data[f] = closeness(g, g.nodes[j]);
                //console.log(node.data[f]);
            }
        },
        nodeAccs: {
            "Closeness Centrality": {type: "number", fct: g5.createAccessor(f)}
        }});

}(g5)); 