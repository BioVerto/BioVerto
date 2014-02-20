/* 08-FEB-2014 Tejas
 Returns BetweenNess Centrality for all vertices of the given graph.
 */
(function(g5) {

    var closenes = function bellman_ford(g, source) {
        var nodes = g.listNodes();
       var INF = 4294967295;
        /* STEP 1: initialisation */
        for (var n in nodes)
            nodes[n].distance = INF;
        /* predecessors are implicitly null */
        source.distance = 0;

        //console.log("Initially, all distances are infinite and all predecessors are null.");
        
        /* STEP 2: relax each edge (this is at the heart of Bellman-Ford) */
        /* repeat this for the number of nodes minus one */
        for (var i = 1; i < nodes.length; i++)
            /* for each edge */
            for (var e in g.edges) {
                //console.log(e);
                var edge = g.edges[e];
                //console.log(edge.source.distance + "\t" + edge.weight  + "\t" + edge.target.distance);
                if (edge.source.distance + edge.weight < edge.target.distance) {
                    //console.log("Relax edge between " + edge.source.id + " and " + edge.target.id + ".");
                    edge.target.distance = edge.source.distance + edge.weight;
                    edge.target.predecessor = edge.source;
                    edge.source.betweeness += 1;
                    edge.target.betweeness += 1;
                }
                //Added by Jake Stothard (Needs to be tested)
                if (!edge.directed) {
                    if (edge.target.distance + edge.weight < edge.source.distance) {
                        //console.log("Relax edge between "+edge.target.id+" and "+edge.source.id+".");
                        edge.source.distance = edge.target.distance + edge.weight;
                        edge.source.predecessor = edge.target;
                        edge.source.betweeness += 1;
                        edge.target.betweeness += 1;
                    }
                }
            }
        //console.log("Calculated closeness for " + source.id);
        var sum = 0.0;
        for (j in nodes) {
            sum += 1.0/nodes[j].distance;
        }
        var closeness =  sum;
        //console.log(source.id + " " + sum);
        return closeness;
    }
    /* STEP 3: TODO Check for negative cycles */
    /* For now we assume here that the graph does not contain any negative
     weights cycles. (this is left as an excercise to the reader[tm]) */
    var f = g5.newField();
    g5.addAlgoPlugin({
        name: "Closeness Centrality",
        algo: function(g) {
            
            for (j in g.nodes) {
                var node = g.nodes[j];
                node.data[f] = closenes(g, g.nodes[j]);
                console.log(node.data[f]);
            }
        },
        nodeAccs: {
            "Closeness Centrality": {type: "number", fct: g5.createAccessor(f)}
        },visible:true});

}(g5)); 