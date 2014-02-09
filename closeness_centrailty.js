
var node = function(id){
	var n = new Object();
	n.id = id;
	n.distance = -1;
	return n;
}

var edge = function(s,t,w){
		var e = new Object();
        e.source = s;
        e.target = t;
		e.weight = w;
		e.directed = false;
        return e;
}

// sample test case g1, g2


var g1 = {};

g1.nodes = [];

g1.edges = [];

g1.nodes[0] = node(0);
g1.nodes[1] = node(1);
g1.nodes[2] = node(2);
g1.nodes[3] = node(3);


g1.edges[0] = new edge(g1.nodes[0],g1.nodes[2],1);
g1.edges[1] = new edge(g1.nodes[1],g1.nodes[2],1);
g1.edges[2] = new edge(g1.nodes[2],g1.nodes[3],1);
g1.edges[3] = new edge(g1.nodes[1],g1.nodes[3],1);


var g2 = {}  

g2.nodes = [];
g2.edges = [];

g2.nodes[0] = node(0);
g2.nodes[1] = node(1);
g2.nodes[2] = node(2);
g2.nodes[3] = node(3);
g2.nodes[4] = node(4);

//console.log(g.nodes);

g2.edges[0] = new edge(g2.nodes[0],g2.nodes[2],1);
g2.edges[1] = new edge(g2.nodes[1],g2.nodes[2],1);
g2.edges[2] = new edge(g2.nodes[2],g2.nodes[3],1);
g2.edges[3] = new edge(g2.nodes[2],g2.nodes[4],1);

//console.log(g.edges);


var closenes = function bellman_ford(g, source) {

    /* STEP 1: initialisation */
    for(var n in g.nodes)
        g.nodes[n].distance = Infinity;
        /* predecessors are implicitly null */
    source.distance = 0;
    
    //console.log("Initially, all distances are infinite and all predecessors are null.");
    
    /* STEP 2: relax each edge (this is at the heart of Bellman-Ford) */
    /* repeat this for the number of nodes minus one */
    for(var i = 1; i < g.nodes.length; i++)
        /* for each edge */
		for(var e in g.edges) {
            //console.log(e);
			var edge = g.edges[e];
			//console.log(edge.source.distance + "\t" + edge.weight  + "\t" + edge.target.distance);
            if(edge.source.distance + edge.weight < edge.target.distance) {
                //console.log("Relax edge between " + edge.source.id + " and " + edge.target.id + ".");
                edge.target.distance = edge.source.distance + edge.weight;
                edge.target.predecessor = edge.source;
				edge.source.betweeness += 1;
				edge.target.betweeness += 1;
			}
	    //Added by Jake Stothard (Needs to be tested)
	    if(!edge.directed) {
			if(edge.target.distance + edge.weight < edge.source.distance) {
                    //console.log("Relax edge between "+edge.target.id+" and "+edge.source.id+".");
                    edge.source.distance = edge.target.distance + edge.weight;
                    edge.source.predecessor = edge.target;
					edge.source.betweeness += 1;
					edge.target.betweeness += 1;
			}
		  }
        }
    //console.log("Calculated closeness for " + source.id);
	var sum = 0;
    for(j in g.nodes){
		sum += g.nodes[j].distance;
	}
	var closeness = 1/sum;
	//console.log(source.id + " " + sum);
	source.closeness = closeness;
	
    /* STEP 3: TODO Check for negative cycles */
    /* For now we assume here that the graph does not contain any negative
       weights cycles. (this is left as an excercise to the reader[tm]) */
};


var calculate_Closeness = function(g) {

	for(j in g.nodes){
		closenes(g,g.nodes[j]);
	}

	for(j in g.nodes){
		console.log(g.nodes[j].closeness);  // prints the closeness for each of nodes; higher the closeness value more important is the node
	}

};


calculate_Closeness(g1);


// other algorithms

// graph isomorphism, to check if two chemical structures are similar



var check_graphIsomorphism = function(g1,g2) {

	if(!(g1.nodes.length == g2.nodes.length)) return false;
	if(!(g1.edges.length == g2.edges.length)) return false;
	
	return true;
	
	// check for degrees of each nodes
	// connected
	// cycle

};

console.log(check_graphIsomorphism(g1,g1));




// degree centrality

var calculate_DegreeCentrality = function(g){

	for(i in g.nodes){
		g.nodes[i].degree_Centrality = 0;
	}

	for (i in g.edges){
		var node1 = g.edges[i].source;
		var node2 = g.edges[i].target;
		node1.degree_Centrality += 1;
		node2.degree_Centrality += 1;
	}

	for(i in g.nodes){
		console.log(g.nodes[i].degree_Centrality); // returns total degree assuming the graph is undirected
	}

	for(i in g.nodes){
		console.log(g.nodes[i].degree_Centrality);
	}
};

calculate_DegreeCentrality(g1);

