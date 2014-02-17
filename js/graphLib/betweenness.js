/* updated on 15-FEB-2014 by Tejas
  Returns BetweenNess Centrality for all vertices of the given graph.
  BetweenNess centrality for a node is the importance of the node based on how many shortest paths
   in the graph pass through it. In short, how many shortest paths will suffer if the node is removed
 */
(function(g5) {
    //these are some global variables: will be initialized after constructing adjacency matrix
    var INF=4294967295;   //Not the largest int in js to avoid potential overflow on increment
    var btwnnss=[];  //Betweenness values for each node will be stored in this array
    var next=[]; //Stores the intermediate node along a shortest path, required for reconstruction
    var N=0;  //Number of nodes, initialized after constructAdjacencyMatrix()
    var dist=[];  //adjacency matrix form of the graph g5, initialized after constructAdjacencyMatrix()
    var f = g5.newField();

    g5.addAlgoPlugin({
        name: "Betweenness Centrality",
        algo: function(g) {
            dist = g.getAdjacencyMatrix();  //dist is the adjacency matrix of input graph
            N = dist.length;  //number of nodes in the graph
            for (i=0; i<N; i++) {  //initialize btwnnss and next arrays
                btwnnss.push(0);
                next[i] = new Array();
                for (j=0; j<N; j++)
                    next[i][j] = null;
            }

            AllPairShortestPaths();
            ReconstructPaths();
            var j = 0;
            for (i in g.nodes) {
                var node = g.nodes[i];
                node.data[f] = btwnnss[j++];
            }
        },
        nodeAccs: {
            "Betweenness Centrality": {type: "number", fct: g5.createAccessor(f)}
        }});

    //updates shortest distance between pairs of nodes into dist[][]
    //and update intermediate node along the route into next[][]
    function AllPairShortestPaths() { //Floyd-Warshall algorithm
        for (k=0; k<N; k++)
            for (i=0; i<N; i++)
                for (j=0; j<N; j++)  //if used instead of Min() because need to update next[][] value
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        next[i][j] = k;  //next[][] will be useful in Path() function
                    }
    }

    //retrace shortest paths to calculate how many of them pass through each node
    function ReconstructPaths() {
        for (i=0; i<N; i++) {
            for (j=0; j<N; j++) {
                Path(i, j);  //its a recursive function, hence has been written separately
            }
        }
    }

    //increment btwnnss value for each node for every shortest path passing through it
    function Path(i, j) {
        var intermediate = next[i][j];
        if (!(intermediate===null)) {
            btwnnss[intermediate]++;  //betweenness values for each node get calculated/populated here!
            return Path(i, intermediate) + intermediate + Path(intermediate, j);
        }
    }

}(g5));
