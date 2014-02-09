/* Copyright Tera Insights, 2013. Released under MIT license */

/*
 *  Dracula Graph Layout and Drawing Framework 0.0.3alpha
 *  (c) 2010 Philipp Strathausen <strathausen@gmail.com>, http://strathausen.eu
 *  Contributions by Jake Stothard <stothardj@gmail.com>.
 *
 *  based on the Graph JavaScript framework, version 0.0.1
 *  (c) 2006 Aslak Hellesoy <aslak.hellesoy@gmail.com>
 *  (c) 2006 Dave Hoover <dave.hoover@gmail.com>
 *
 *  Ported from Graph::Layouter::Spring in
 *    http://search.cpan.org/~pasky/Graph-Layderer-0.02/
 *  The algorithm is based on a spring-style layouter of a Java-based social
 *  network tracker PieSpy written by Paul Mutton <paul@jibble.org>.
 *
 *  This code is freely distributable under the MIT license. Commercial use is
 *  hereby granted without any cost or restriction.
 *
 *  Links:
 *
 *  Graph Dracula JavaScript Framework:
 *      http://graphdracula.net
 *
 /*--------------------------------------------------------------------------*/
//graph object
/*	var graph ={};
 console.log(graph);
 */
/*
 * Edge Factory
 */
angular.module("MyApp")
        .service('graphProvider', function() {

            var EdgeFactory = function() {
                this.template = new Object();
                this.template.data = new Object();
                this.template.directed = false;
                this.template.weight = 1;
            };
            EdgeFactory.prototype = {
                build: function(source, target) {
                    var e = jQuery.extend(true, {}, this.template);
                    e.source = source;
                    e.target = target;
                    return e;
                }
            };

            /*
             * Graph
             */
//DISCUSS:Singleton
            var Graph = function() {

                this.nodes = {};//changed to array
                this.edges = [];
                this.snapshots = []; // previous graph states TODO to be implemented
                this.edgeFactory = new EdgeFactory();
                this.nodeAccessors = {};
                this.edgeAccessors = {};
                // name generator for fields to be added to objects
                // global counter for name generation
                this.nCnt = 0;
                //	return graph;

            };

            Graph.prototype = {
                /* 
                 * add a node
                 * @id          the node's ID (string or number)
                 * @content     (optional, dictionary) can contain any information that is
                 *              being interpreted by the layout algorithm or the graph
                 *              representation
                 * addNode will update the information if the node already exists
                 */
                getData: function()
                {
                    var temp = {};
                    temp.edges = this.listEdges();
                    temp.nodes = this.listNodes();
                    return temp;
                },
                listNodes: function() {
                    var nodes = [];

                    for (var n in this.nodes) {

                        nodes.push(this.nodes[n]);

                    }

                    return nodes;

                },
                listEdges: function() {
                    return this.edges;

                },
                addNode: function(id, content) {
                    /* testing if node is already existing in the graph */
                    if (this.nodes[id] == undefined) {
                        this.nodes[id] = new Graph.Node(id, content);
                    } else {
                        jQuery.extend(this.nodes[id].data, content);//data->content
                    }
                    return this.nodes[id];
                },
                // TODO: allow update of data for an edge
                //Discuss with Prof. DOBRA
                addEdge: function(source, target, data, directed) {


                    var s = this.addNode(source);
                    var t = this.addNode(target);
                    var edge = this.edgeFactory.build(s, t);
                    jQuery.extend(edge.data, data);
                    if (directed) { // if directed edge, add it to target adjList
                        t.edges.push(edge);
                        edge.directed = true;
                    }
                    s.edges.push(edge);
                    this.edges.push(edge);
                },
                removeNode: function(id) {
                    delete this.nodes[id];
                    for (var i = 0; i < this.edges.length; i++) {
                        if (this.edges[i].source.id == id || this.edges[i].target.id == id) {
                            this.edges.splice(i, 1);
                            i--;
                        }
                    }
                },
                /* Acessor Functions*/
                addNodeAccessor: function(name, type, fct) {
                    if (this.nodeAccessors[name] !== undefined) {
                        alert("A node accessor with the name " + name + " is already present. Ignoring");
                        return;
                    }

                    this.nodeAccessors[name] = fct;
                    this.nodeAccessors[name].returnType = type; // ??catergorical or continuous // how to handle type information
                    this.nodeAccessors[name].type = "Node";
                },
                addEdgeAccessor: function(name, type, fct) {
                    if (this.edgeAccessors[name] !== undefined) {
                        alert("A edge accessor with the name " + name + " is already present. Ignoring");
                        return;
                    }
                    this.edgeAccessors[name] = fct;
                    this.edgeAccessors[name].returnType = type; // catergorical or continuous//Attach property to Function Object???
                    this.edgeAccessors[name].type = "Edge";
                },
                createAccessor: function(member) {
                    // QUESTION: is this better than creating a function using new Function or eval?
                    var f = function(obj) {

                        return obj.data.data[member];
                    };
                    return f;
                }
                ,
                newField: function() {
                    return "_" + (this.nCnt++);
                },
                listNodeAccessors: function() {
                    return this.nodeAccessors;
                },
                listEdgeAccessors: function() {
                    return this.edgeAccessors;
                }

            };
            /*
             * Node
             */
            Graph.Node = function(id, data) {
                if (data === undefined)
                {
                    data = {}
                }
                var node = {};
                node.edges = [];
                node.data = data;
                node.data.id = id;
                return node;
            };

            Graph.Node.prototype = {
            };
            this.createGraph = function() {
                return new Graph();
            }

        });