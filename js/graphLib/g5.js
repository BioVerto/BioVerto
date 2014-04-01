// import "graph.js"
/* 
 This file defines the g5 framework. 
 
 */
// main g5 object 
var g5 = {};
g5.graphs = {};
g5.version = .1;
g5.nCnt = 0; // counter for generated variables

g5.newField = function() {
    return "_" + (g5.nCnt++);
}
// plugins with algorithms suported by the framework. Algorithmic
// plugins run algorithms on the graph to compute new properties
g5.algoPlugins = {};

// add a pluging. Each plugin defines an algorithm
// @name: name of the plugin. Has to be unique
// @algo: the algorithm function
g5.addAlgoPlugin = function(obj) {
    // TODO: check that the obj is correct
    var name = obj.name;
    if (g5.algoPlugins[name] !== undefined) {
        codingError("A plugin with the name " + name + " is already present. Ignoring");
        return;
    }
    g5.algoPlugins[name] = obj;
    return g5;
};
// function to list available algorithms
g5.listAlgorithms = function() {
    var rez = [];
    for (var alg in g5.algoPlugins)
    {
        if (typeof g5.algoPlugins[alg].visible === undefined)
        {
            g5.algoPlugins[alg].visible = true;
        }
        if (g5.algoPlugins[alg].visible)
        {
            rez.push(alg);
        }
    }
    return rez;
};

// I/O plugins allow the construction of the graphs from various input
// sources. The input is always a Blob. Output is a blob as well.
// A blob can be created from one string with Blob([myString])
// A blob can be created from an array of strings with Blob(myStringArray)
g5.ioPlugins = {};

// add I/O plugins
// @name: the name of the plugin
// @inputFct: function(Blob) -> Graph()
// @outputFct: function(Graph) -> Blob
g5.addIOPlugin = function(name, inputFct, outputFct) {
    if (g5.ioPlugins[name] !== undefined) {
        codingError("A plugin with the name " + name + " is already present. Ignoring");
        return;
    }
    g5.ioPlugins[name] = {input: inputFct, output: outputFct};
    return g5;
};
// use a plugin to create a graph 
// function to create graph 
g5.createGraph = function(name) {
    if (g5.graphs[name] !== undefined) {
        codingError("A graph with the name " + name + " is already present. Ignoring");
        if (confirm("A graph with same name exits. Do you want to overwrite the existing graph"))
        {
             delete g5.graphs[name];
           
        }
        else
        {
            return;
        }
        // delete g5.graphs[name];

    }

    g5.graphs[name] = new Graph();
    return g5.graphs[name];
};
//function to return reference of Graph object
g5.returnGraph = function(name) {
    return g5.graphs[name];
};

// function to apply an algorighm to a graph
g5.applyAlgorithm = function(g, algoName) {
    var alg = g5.algoPlugins[algoName]; // TODO: check for error 
    alg.algo(g); // apply the algorithm on the graph
    if (alg.nodeAccs !== undefined) // register node accessors with the graph
        for (var nA in alg.nodeAccs)
            g.addNodeAccessor(nA, alg.nodeAccs[nA].type,
                    alg.nodeAccs[nA].fct);
    if (alg.edgeAccs !== undefined) // register node accessors with the graph
        for (var eA in alg.edgeAccs)
            g.addEdgeAccessor(eA, alg.edgeAccs[eA].type,
                    alg.edgeAccs[eA].fct);
};
// create a graph from a blog using an IO plugin
// @pluggin: the name of the IO plugin
// @blob: the blob containing the content
g5.loadGraphFromFile = function(plugin, blob, graphName, source, target, directed) {
    // Look for the input function of the pluggin and call it
    g5.loadGraphFromObjArray(g5.generateObjArray(plugin, blob), graphName, source, target, directed);
};
g5.generateObjArray = function(plugin, blob)
{
    if (g5.ioPlugins[plugin] == undefined) {
        codingError("A plugin for " + plugin + "  doesnt exists");
        return;
    }
    return g5.ioPlugins[plugin].input(blob);
};
g5.loadGraphFromObjArray = function(data, graphName, source, target, directed)
{
    if (typeof directed === 'undefined')
    {
        directed = false;
    }
    source = source || "source";
    target = target || "target";
    var graph = g5.createGraph(graphName);
    if (!graph)
    {
        return g5.graphs[graphName];
    }
    data.forEach(function(d) {
        // assuming that source and target columns are defined
        var s = d[source];
        var t = d[target];
        delete d[source];
        delete d[target];
        graph.addEdge(s, t, d, directed);
    });
    graph.addInitialAccFunctions();

    g5.applyAlgorithm(graph, "Degree Centrality");

    g5.applyAlgorithm(graph, "Uniprot Data");
    g5.applyAlgorithm(graph, "Connected Components");
    return graph;
};



// Factory for accessor function
// @member: string with the name of the member element
g5.createAccessor = function(member) {
    // QUESTION: is this better than creating a function using new Function or eval?
    var f = function(obj) {
        return obj.data[member];
    };
    return f;
};

g5.listGraphs = function()
{
    var result = new Array();

    for (var name in g5.graphs)
    {

        result.push(name);

    }
    return result;
};

g5.getGraph = function(name)
{
    return g5.graphs[name];
};

