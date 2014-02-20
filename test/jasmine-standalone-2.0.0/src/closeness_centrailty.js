
var closenes = function bellman_ford(g, source) {
	
	list_nodes = g.nodes;
	list_edges = g.edges;
	
    /* STEP 1: initialisation */
    for(var n in list_nodes){
        list_nodes[n].data.distance = Infinity;
		
    }/* predecessors are implicitly null */
    source.data.distance = 0;
    
    //console.log("Initially, all distances are infinite and all predecessors are null.");
    
    /* STEP 2: relax each edge (this is at the heart of Bellman-Ford) */
    /* repeat this for the number of nodes minus one */
    for(var i = 1; i < list_nodes.length; i++)
        /* for each edge */
		for(var e in list_edges) {
            //console.log(e);
			var edge = list_edges[e];
			//console.log(edge.source.distance + "\t" + edge.weight  + "\t" + edge.target.distance);
            if(edge.source.data.distance + edge.weight < edge.target.data.distance) {
                //console.log("Relax edge between " + edge.source.id + " and " + edge.target.id + ".");
                edge.target.data.distance = edge.source.data.distance + edge.weight;
                edge.target.data.predecessor = edge.source.data.id;
				
			}
	    //Added by Jake Stothard (Needs to be tested)
	    if(!edge.directed) {
			if(edge.target.data.distance + edge.weight < edge.source.data.distance) {
                    //console.log("Relax edge between "+edge.target.id+" and "+edge.source.id+".");
                    edge.source.data.distance = edge.target.data.distance + edge.weight;
                    edge.source.data.predecessor = edge.target.data.id;
					
			}
		  }
        }
    //console.log("Calculated closeness for " + source.id);
	var sum = 0;
    for(j in list_nodes){
		sum += list_nodes[j].data.distance;
	}
	var closeness = 1/sum;
	//console.log(source.id + " " + sum);
	return closeness;
};


var calculate_Closeness = function(g) {
	list_nodes1 = g.nodes;
	var close = [];
	for(j in list_nodes1){
		close[j] = closenes(g,list_nodes1[j]);
	}
	return close;
};


//calculate_Closeness(g1);


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

//console.log(check_graphIsomorphism(g1,g1));




// degree centrality

var calculate_DegreeCentrality = function(g){

	for(i in list_nodes){
		list_nodes[i].degree_Centrality = 0;
	}

	for (i in list_edges){
		var node1 = list_edges[i].source;
		var node2 = list_edges[i].target;
		node1.degree_Centrality += 1;
		node2.degree_Centrality += 1;
	}

	for(i in list_nodes){
		console.log(list_nodes[i].degree_Centrality); // returns total degree assuming the graph is undirected
	}

	for(i in list_nodes){
		console.log(list_nodes[i].degree_Centrality);
	}
};

//calculate_DegreeCentrality(g1);

