// import "g5.js"
// import "d3.js"

/* This file contains base IO pluggins */


// Comma separated edge graph with implicit nodes
(function(g5){
    g5.addIOPlugin(
	"csv",
	// TODO: allow the separator to be specified by arg1 
	function(blob, source, target){
	    source = source || "source";
	    target = target || "target";
	    var graph = g5.createGraph();
	    //TODO:d3.csv.parse(blob, function(data){
	    d3.csv(blob, function(data){//csv is parsed thorugh a, file blob is a file path
		//console.log(data);

		// select the first element and add accessor functions for mebers
		var el = data[0] || {};
		for (v in el){
		    g5.addEdgeAccessor(v, g5.createAccessor(v));
		}

		


		data.forEach(function(d){//no each for array
		    // assuming that source and target columns are defined
		    var s = d[source];
		    delete d[source];
		    var t = d[target];
		    delete d[target];
		    //console.log(s+" "+t);
		    graph.addEdge(s, t, d);
		});
		
		//console.log(graph.nodes.id1);
		//console.log(g5.nodeAccessors.name(graph.nodes.id1));
		//console.log(g5.nodeAccessors.name(graph.nodes.id1));
		//console.log(g5.listNodes());
		//console.log(g5.listEdges());		
		//console.log(g5.listNodes().indexOf(g5.listEdges()[3].source));
		
	

	    });
	    return graph;
	},
	// TODO implement this
	undefined
    );
}(g5));
