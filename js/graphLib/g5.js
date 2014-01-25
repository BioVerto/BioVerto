// import "graph.js"
/* 
   This file defines the g5 framework. 
   
*/


// main g5 object 
var g5 = {};
var graph;

g5.version = .1;

// name generator for fields to be added to objects
// global counter for name generation
g5.nCnt = 0;
g5.newField = function(){
    return "_"+(g5.nCnt++);
}

// plugins with algorithms suported by the framework. Algorithmic
// plugins run algorithms on the graph to compute new properties
g5.algoPlugins = {};

// add a pluging. Each plugin defines an algorithm
// @name: name of the plugin. Has to be unique
// @algo: the algorithm function
g5.addAlgoPlugin = function(name, algo){
    if (g5.algoPlugins[name] !== undefined){
	alert("A plugin with the name "+name+" is already present. Ignoring");
	return;
    }

    g5.algoPlugins[name] = { algo: algo };
    return g5;
}


// I/O plugins allow the construction of the graphs from various input
// sources. The input is always a Blob. Output is a blob as well.
// A blob can be created from one string with Blob([myString])
// A blob can be created from an array of strings with Blob(myStringArray)
g5.ioPlugins = {};

// add I/O plugins
// @name: the name of the plugin
// @inputFct: function(Blob) -> Graph()
// @outputFct: function(Graph) -> Blob
g5.addIOPlugin = function(name, inputFct, outputFct){
    if (g5.ioPlugins[name] !== undefined){
	alert("A plugin with the name "+name+" is already present. Ignoring");
	return;
    }

    g5.ioPlugins[name] = { input: inputFct, output: outputFct };
    return g5;
}

// function to create graph 
g5.createGraph = function(){
    graph= new Graph();
    return graph;
}
//function to return reference of Graph object
g5.returnGraph = function(){
    return Graph();
}



// create a graph from a blog using an IO plugin
// @pluggin: the name of the IO plugin
// @blob: the blob containing the content
g5.loadGraph = function(pluggin, blob, arg1, arg2, arg3){
    // Look for the input function of the pluggin and call it
}


// Accessor functions allow the information in the graph nodes and
// edges to be accessed by programs. The accessor functions are added
// by plugins. Typically, an algorithm adds a new piece of information
// to data part of node or edge and registers an accessor function to
// access this info. I/O plugins define accessors for all type of
// information they encounter

// all accessor repositories go from name->accessorFct
g5.nodeAccessors = {};
g5.edgeAccessors = {};
g5.addNodeAccessor = function(name, fct){
    if (g5.nodeAccessors[name] !== undefined){
	alert("A node accessor with the name "+name+" is already present. Ignoring");
	return;
    }

    g5.nodeAccessors[name] = fct;
    return g5;
}
g5.addEdgeAccessor = function(name, fct){
    if (g5.edgeAccessors[name] !== undefined){
	alert("A edge accessor with the name "+name+" is already present. Ignoring");
	return;
    }

    g5.edgeAccessors[name] = fct;
    return g5;
}

// return the list of node accessors
g5.listNodeAccessors = function(){
    return g5.nodeAccessors.map(function(d,i){ return i; });
}


// Factory for accessor function
// @member: string with the name of the member element
g5.createAccessor = function(member){
    // QUESTION: is this better than creating a function using new Function or eval?
    var f = function(obj){ return obj.data[member]; };
    return f;
}

// add an accessor function for id->name and weigh->weight
g5.addNodeAccessor("name", g5.createAccessor("id"));
g5.addEdgeAccessor("weight", g5.createAccessor("weigth"));
//g5.nodeAccessors["name"](g5.nodes.id1);


g5.listNodes = function(){

	
	var nodes =[];
	
	for(var n in graph.nodes){
		
		nodes.push(graph.nodes[n]);
	
	}
	
	return nodes;
	
}

g5.listEdges = function(){

	return graph.edges;

}
