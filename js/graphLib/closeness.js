/* 7-MARCH-2014 @Author Parag
 Returns Closeness Centrality for all vertices of the given graph.
 Calculates single source shortest path to other vertices and sums the distances(this is farness).
 Its inverse is the closeness for that node.
 More central a node in a graph, lesser would be its sum of distances to other nodes and hence higher would be its closeness value. 
 Tested on -
 test.csv, test2.csv
 Mint full networks - Pisum sativum
 */
(function(g5) {
	
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
            var map = [];
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
	

	
	function truncateDecimals (num, digits) {
		var numS = num.toString(),
        decPos = numS.indexOf('.'),
        substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
        trimmedResult = numS.substr(0, substrLength),
        finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

		return parseFloat(finalResult);
	}
	
    var f = " ";
    g5.addAlgoPlugin({
        name: "Closeness Centrality",
        algo: function(g) {
              f = g.newField();
            //N = Object.keys(g.nodes).length
            for(var k in g.connectedComponentsNodes){   
			
                var currentEdges = g.connectedComponentsEdges[k]; 
				
                var currentNodes = g.connectedComponentsNodes[k];
				
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
					sum1 = (1/sum1); 
					closenessVal[i] = truncateDecimals(sum1,4);		// truncate to 4 decimal places
				}
				
				var j = 0;
				for (var key in currentNodes)   //iterating over each node of the current component
                    currentNodes[key].data[f] = (closenessVal[j++]); //setting the betweenness value to half that calculated, since graph is undirected
	            
        	}	
        },
        nodeAccs:function(){return  {
            "Closeness Centrality": {type: "number", fct: g5.createAccessor(f)}
        }},visible:true});

}(g5)); 