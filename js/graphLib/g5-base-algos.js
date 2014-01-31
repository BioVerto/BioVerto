// import "g5.js"

/* This file contains basic algorithmic pluggins */


// Out degree computation. Simply counts the numer of out degrees
(function(g5){
    // new field and register accessor for it under algo name
    var f = g5.newField();
    g5.addNodeAccessor("outDegree",  g5.createAccessor(f));

    g5.addAlgoPlugin(
	"outDegree",
	function(g){
	    for (i in g.nodes){
		var node = g.nodes[i];
		node.data[f] = node.edges.length;
	    }
	});
}(g5));
