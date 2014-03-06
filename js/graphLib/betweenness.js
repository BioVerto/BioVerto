/* Updated by Tejas on March 3rd 2013
 * This script inserts betweenness centrality value into a field of each node in the graph.
*/
(function(g5) {
    var Bfield = g5.newField(); //new field in the graph, at the same level in hierarchy/structure as g5.graphs
    g5.addAlgoPlugin({ name: "Betweenness Centrality",  //addAlgoPlugin is at the same level in hierarchy/structure as g5.graphs and g5.newField()
    algo: function(g) {
 
            for(var k in g.connectedComponentsNodes){   //kth component/subgraph of the entire graph will henceforth be accessed as g.connectedComponentNodes[k]
                var currentEdges = g.connectedComponentsEdges[k]; //g.connectedComponentsNodes is at the same level as g. To access subgraph, we're gonna have to replace all g's
                var currentNodes = g.connectedComponentsNodes[k]; //... with something one level below it, that means replace g by g.connectedComponentsNodes[k]
                nc = currentNodes.length;
                var betwnss = new Float32Array(nc);
                var next = new Float32Array(nc*nc); for (j=0; j<nc*nc; j++) next[j] = Number.POSITIVE_INFINITY; // there's Array.prototype.map() available for prefilling with infinities, but thats actually slower
                var dist = constructAdjacencyMatrix(currentNodes, currentEdges); //construct adjacency matrix for a particular component, cause this is where we're gonna get real performance gains
                AllPairShortestPaths();     //compute shortest path lengths (not the paths themselves) for a particular component using FloydWarshall algorithm
                ReconstructPaths();     //retrace the shortest paths and increment the betwnss for each particular node once everytime a shortest path includes that node
                var j = 0;          //we're gonna use this as a counter to iterate over each node of a particular component to access its betwnss value and put it into global betwinness
                for (var key in currentNodes)   //iterating over each node of the current component
                    currentNodes[key].data[Bfield] = (betwnss[j++])/2; //setting the betweenness value to half that calculated, since graph is undirected
            }
            function AllPairShortestPaths() { //Floyd Warshall algorithm, calculates only shortest-path-lengths, not actual paths
                for (k = 0; k < nc; k++)
                    for (i = 0; i < nc; i++)
                        for (j = 0; j < nc; j++)
                            if (dist[(i*nc)+j] > dist[(i*nc)+k] + dist[(k*nc)+j]) {
                                dist[(i*nc)+j] = dist[(i*nc)+k] + dist[(k*nc)+j];
                                next[(i*nc)+j] = k; //next[] stores the intermediate nodes along the current shortest path
                            }
            }
            function ReconstructPaths() { //reconstruct the actual shortest paths temporarily to find betweenness centrality
                for (i = 0; i < nc; i++)
                    for (j = 0; j < nc; j++)
                        Path(i, j);  // while retracing a shortest path, increment by 1 the betweenness value of each node along the way
            }
            function Path(i, j) {
                var intermediate = next[(i*nc)+j];
                if (intermediate!==Number.POSITIVE_INFINITY) {
                    betwnss[intermediate]++;
                    return Path(i, intermediate) + intermediate + Path(intermediate, j);
                }
            }
    }, nodeAccs: { "Betweenness Centrality": {type: "number", fct: g5.createAccessor(Bfield)} },visible:true});

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
}(g5));
