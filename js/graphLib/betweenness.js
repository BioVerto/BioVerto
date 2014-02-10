/* 08-FEB-2014 Tejas
 Returns BetweenNess Centrality for all vertices of the given graph.
 */
(function(g5) {
    var INF = 4294967295;
    var N = 0;
    var count = [];
    var dist = [];
    var next = new Array();

    function constructAdjacencyMatrix(g)
    {
        var myNodes = g.listNodes();
        var myEdges = g.listEdges();
        N = myNodes.length;
        console.log("N is "+N)
        var n = myNodes.length;
        var table = new Array(n);
        var input = new Array(n);
        for (var i = 0; i < n; i++)
            input[i] = new Array(n);

        for (var i = 0; i < n; i++)
        {
            for (var j = 0; j < n; j++)
            {
                if (i === j)
                {
                    input[i][j] = 0;
                }
                else
                    input[i][j] = INF;
            }
        }

//create a dictionary for nodes so that I can get id associated with each node
        for (var i = 0; i < n; i++)
        {
            table[myNodes[i].data.id] = i;

        }
//create the adjecancy matrix for the graph
        for (var i = 0; i < myEdges.length; i++)
        {
            input[table[myEdges[i].source.data.id]][table[myEdges[i].target.data.id]] = 1;
            input[table[myEdges[i].target.data.id]][table[myEdges[i].source.data.id]] = 1;
        }
        dist = input;
         for (i = 0; i < N; i++) {
        count.push(0); 
        }
        for (i = 0; i < N; i++) {
            next[i] = new Array();
            for (j = 0; j < N; j++)
                next[i][j] = null;
        }
    }

    function AllPairShortestPaths() {
        for (k = 0; k < N; k++)
            for (i = 0; i < N; i++)
                for (j = 0; j < N; j++)
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        next[i][j] = k;
                    }
    }
    function ReconstructPaths() {
        for (i = 0; i < N; i++) {
            for (j = 0; j < N; j++) {
                console.log("from " + i + " to " + j + " the shortest path is = " + i + Path(i, j) + j);
            }
            console.log("\n");
        }
    }
    function Path(i, j) {
        if (dist[i][j] === INF) {
            return "no path";
        }
        var intermediate = next[i][j];
        if (intermediate === null) {
            return " ";
        }
        else {
            count[intermediate]++;
            return Path(i, intermediate) + intermediate + Path(intermediate, j);
        }
    }
    var f = g5.newField();
    g5.addAlgoPlugin({
        name: "Betweenness Centrality",
        algo: function(g) {
            constructAdjacencyMatrix(g);
            AllPairShortestPaths();
            ReconstructPaths();
            var j = 0;
            for (i in g.nodes) {
                var node = g.nodes[i];
                node.data[f] = count[j++];
            }
        },
        nodeAccs: {
            "Betweenness Centrality": {type: "number", fct: g5.createAccessor(f)}
        }});
}(g5)); 