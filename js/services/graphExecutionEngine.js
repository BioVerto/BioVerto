angular.module("MyApp")
        .service('graphExecutionEngine', function(graphProvider, graphIOPluginProvider,graphAlgoPluginProvider) {
            var g5 = {};
            var graphs = {};
            g5.graph = null;
            g5.version = .1;


// plugins with algorithms suported by the framework. Algorithmic
// plugins run algorithms on the graph to compute new properties
            g5.algoPlugins = {};

// add a pluging. Each plugin defines an algorithm
// @name: name of the plugin. Has to be unique
// @algo: the algorithm function
            g5.addAlgoPlugin = function(name, algo) {
                if (g5.algoPlugins[name] !== undefined) {
                    alert("A plugin with the name " + name + " is already present. Ignoring");
                    return;
                }
                g5.algoPlugins[name] = {algo: algo};
                return g5;
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
                    alert("A plugin with the name " + name + " is already present. Ignoring");
                    return;
                }
                g5.ioPlugins[name] = {input: inputFct, output: outputFct};
                return g5;
            };

// function to create graph 
            g5.createGraph = function(name) {
                if (graphs[name] !== undefined) {
                    alert("A graph with the name " + name + " is already present. Ignoring");
                    return;
                }

                graphs[name] = graphProvider.createGraph();
                return graphs[name];
            };
//function to return reference of Graph object
            g5.returnGraph = function(name) {
                return graph[name];
            };



// create a graph from a blog using an IO plugin
// @pluggin: the name of the IO plugin
// @blob: the blob containing the content
            g5.loadGraphFromFile = function(plugin, blob, graphName, source, target, arg3) {
                // Look for the input function of the pluggin and call it
                g5.loadGraphFromObjArray( g5.generateObjArray(plugin,blob), graphName, source, target);
            };
            g5.generateObjArray = function(plugin, blob)
            {
                if (g5.ioPlugins[plugin] == undefined) {
                    var temp = graphIOPluginProvider.getPlugin(plugin);
                    if (temp)
                    {
                        g5.ioPlugins[plugin] = temp;
                    }
                    else
                    {
                        alert("A plugin for " + plugin + "  doesnt exists");
                        return;
                    }
                }
               return g5.ioPlugins[plugin](g5, blob);
            };
            g5.loadGraphFromObjArray = function(data, graphName,source,target)
            {
                 source = source || "source";
                 target = target || "target";
                var graph = graphProvider.createGraph();
                data.forEach(function(d) {
                    // assuming that source and target columns are defined
                    var s = d[source];
                    var t = d[target];
                    delete d[source];
                    delete d[target];
                    graph.addEdge(s, t, d);
                });

                g5.addAccessorFunctions(graph);
                g5.applyAllAlgo(graph);
                graphs[graphName] = graph;
                return graph;
            };
            g5.applyAllAlgo =function(graph)
            {
                var listAlgo = graphAlgoPluginProvider.listAlgo();
                for (var i = 0; i < listAlgo.length; i++) 
                {
                    graphAlgoPluginProvider.getAlgo(listAlgo[i]).call(this,graph);
                }
            }
            g5.addAccessorFunctions = function (graph)
            {
                // select the first element and add accessor functions for mebers
                var el = graph.edges[0].data;
                for (v in el) {
                    if (el[v].match(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/) != null) { //http://stackoverflow.com/questions/1779013/check-if-string-contains-only-digits
                        graph.addEdgeAccessor(v,"number", g5.createAccessor(v));
                    }
                    else{
                        graph.addEdgeAccessor(v,"character", g5.createAccessor(v));
                    }
                }
               
                for (v in graph.nodes) {
                el = graph.nodes[v].data;
                break;
                }
                for (v in el) {
                    if (el[v].match(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/) != null) { 
                        graph.addNodeAccessor(v,"number", g5.createAccessor(v));
                    }
                    else{
                        graph.addNodeAccessor(v,"character", g5.createAccessor(v)); 
                    }
                }
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
// return the list of node accessors
            g5.listNodeAccessors = function(graphName) {
                return jQuery.extend({},graphs[graphName].listNodeAccessors(),g5.nodeAccessors);//graphs[graphName].listNodeAccessors());
            };
            g5.listEdgeAccessors = function(graphName) {
                return jQuery.extend({},graphs[graphName].listEdgeAccessors(),g5.edgeAccessors );
            };
            g5.addNodeAccessor = function(name, fct) {
                if (g5.nodeAccessors[name] !== undefined) {
                    alert("A node accessor with the name " + name + " is already present. Ignoring");
                    return;
                }

                g5.nodeAccessors[name] = fct;
                return g5;
            };
            g5.addEdgeAccessor = function(name, fct) {
                if (g5.edgeAccessors[name] !== undefined) {
                    alert("A edge accessor with the name " + name + " is already present. Ignoring");
                    return;
                }

                g5.edgeAccessors[name] = fct;
                return g5;
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
                var temp = new Array();

                for (var name in graphs)
                {


                    temp.push(name);
                }
                return temp;
            };
            g5.getGraph = function(name)
            {
                return graphs[name];
            };
            return g5;
        });