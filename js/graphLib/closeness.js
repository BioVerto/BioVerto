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
	
    var closeness = function bellman_ford(nodes1,edges1,source) { // calculates single source shortest path for given source node
		
		var nodes = nodes1;
		var edges = edges1;
		var INF = Number.POSITIVE_INFINITY;
		
		console.log("Length" +nodes.length);
		for (var n in nodes)
			nodes[n].data.distance = INF;
		
		source.data.distance = 0;

		//Initially, all distances are infinite and all predecessors are null
			
		for (var i = 1; i < nodes.length; i++){
			
			for (var e in edges) {
				console.log("Edge id " +e);
				var edge = edges[e];
				console.log(edge.source.data.distance + "\t" + edge.weight  + "\t" + edge.target.data.distance);
				 if(edge.source.data.distance + edge.weight < edge.target.data.distance) {
					console.log("Relax edge between " + edge.source.id + " and " + edge.target.id + ".");
					edge.target.data.distance = edge.source.data.distance + edge.weight;
					edge.target.data.predecessor = edge.source.data.id;
				}
				
				if(!edge.directed) {
					if(edge.target.data.distance + edge.weight < edge.source.data.distance) {
						console.log("Not directed" + "Relax edge between "+edge.target.data.id+" and "+edge.source.data.id+".");
						edge.source.data.distance = edge.target.data.distance + edge.weight;
						edge.source.data.predecessor = edge.target.data.id;	
					}
				}		
			}
		}
		
		var sum = 0.0;
		console.log("Distance cal." + source);
		for (j in nodes) {
			console.log(nodes[j].data.distance);
			if(nodes[j].data.distance<4294967295)sum += (nodes[j].data.distance);
		}
		var closeness = roundToTwo(1/(sum));
		//console.log(source.id + " " + sum);
		return closeness;
	}

	function roundToTwo(num) {    
		return +(Math.round(num + "e+4")  + "e-4");
	}

	function AllPairShortestPaths(dist) { //Floyd Warshall algorithm, calculates only shortest-path-lengths, not actual paths
		for (k = 0; k < nc; k++)
			for (i = 0; i < nc; i++)
				for (j = 0; j < nc; j++)
					if (dist[(i*nc)+j] > dist[(i*nc)+k] + dist[(k*nc)+j]) {
						dist[(i*nc)+j] = dist[(i*nc)+k] + dist[(k*nc)+j];
						//next[(i*nc)+j] = k; //next[] stores the intermediate nodes along the current shortest path
					}
    }


	function constructAdjacencyMatrix(currentNodes, currentEdges) { //no point in moving this function to graph.js since there's separate adjacency matrix for each component
            var nc = currentNodes.length;
            var map = new Float32Array(nc);
            var adjMatrix = new Float32Array(nc*nc);
            for (var i = 0; i < nc; i++) {
                map[currentNodes[i].data.id] = i;   //initialize the map with with temporary node indexes (actual node ids are chemical names)
                for (var j = 0; j < nc; j++)
                    if (i !== j) adjMatrix[(i*nc)+j] = Number.POSITIVE_INFINITY; //initialize adjMatrix with all infinities except leftTop to rightBottom diagonals as zeroes
            }
            for (var i = 0; i < currentEdges.length; i++) {
                adjMatrix[(nc*map[currentEdges[i].source.data.id]) + (map[currentEdges[i].target.data.id])] = 1; //for each edge, set its sourceNode-to-targetNode distance as 1 since graph is undirectional, each edge is 2-way, 
                adjMatrix[(nc*map[currentEdges[i].target.data.id]) + (map[currentEdges[i].source.data.id])] = 1; //... hence also set targetNode-to-sourceNode distance as zero. we'll need to halve the betweenness later
            }
        return adjMatrix;
    }
	
	
	function ReconstructPaths() { //reconstruct the actual shortest paths temporarily to find betweenness centrality
                for (i = 0; i < nc; i++)
                    for (j = 0; j < nc; j++)
                        Path(i, j);  // while retracing a shortest path, increment by 1 the betweenness value of each node along the way
    }
	
	function truncateDecimals (num, digits) {
		var numS = num.toString(),
        decPos = numS.indexOf('.'),
        substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
        trimmedResult = numS.substr(0, substrLength),
        finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

		return parseFloat(finalResult);
	}
	
    var f = g5.newField();
    g5.addAlgoPlugin({
        name: "Closeness Centrality",
        algo: function(g) {
            N = Object.keys(g.nodes).length
            for(var k in g.connectedComponentsNodes){   //kth component/subgraph of the entire graph will henceforth be accessed as g.connectedComponentNodes[k]
                var currentEdges = g.connectedComponentsEdges[k]; //g.connectedComponentsNodes is at the same level as g. To access subgraph, we're gonna have to replace all g's
                var currentNodes = g.connectedComponentsNodes[k]; //... with something one level below it, that means replace g by g.connectedComponentsNodes[k]
            	nc = currentNodes.length;
				
				var closenessVal = new Array(nc);
				
				var dist = constructAdjacencyMatrix(currentNodes, currentEdges);
				
				AllPairShortestPaths(dist);
				
				var sum1 = 0.0,sum2,sum3;
				for (i = 0; i < nc; i++){
                    sum1 = 0.0;
					for (j = 0; j < nc; j++){
						sum1 += dist[(i*nc)+j];
					}
					sum1 = (1/sum1)*((nc*nc)/(N*N));				// normalization
					closenessVal[i] = truncateDecimals(sum1,4);		// truncate to 4 decimal places
				}
				
				var j = 0;
				for (var key in currentNodes)   //iterating over each node of the current component
                    currentNodes[key].data[f] = (closenessVal[j++]); //setting the betweenness value to half that calculated, since graph is undirected
	            /*for (j in currentNodes) {
	                var node = currentNodes[j];
	                t = closeness(currentNodes,currentEdges,currentNodes[j]);
	                node.data[f] = roundToTwo(t*((nc*nc)/(N*N)));        // some kind of normalization
                        console.log(node.data[f]);
	            }*/
        	}	
        },
        nodeAccs: {
            "Closeness Centrality": {type: "number", fct: g5.createAccessor(f)}
        },visible:true});

}(g5)); 