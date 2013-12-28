// import "g5.js"
// import "d3.js"

/* This file contains base IO pluggins */


// Comma separated edge graph with implicit nodes
(function(g5){
    g5.addIOPlugin(
	"csv",
	// TODO: allow the separator to be specified by arg1 
	function(blob, source, target){
	    soruce = source || "source";
	    target = target || "target";
	    var graph = g5.createGraph();
	    d3.csv.parse(blob, function(data){
		data.each(function(d){
		    // assuming that source and target columns are defined
		    var source = d[source];
		    delete d[source];
		    var target = d[target];
		    delete d[target];
		    graph.addEdge(source, target, d);
		});
		// select the first element and add accessor functions for mebers
		var el = data[0] || {};
		for (v in el){
		    g5.addEdgeAccessor(v, g5.createAccessor(v));
		}
	    });
	    return graph;
	},
	// TODO implement this
	undefined
    );
}(g5));
