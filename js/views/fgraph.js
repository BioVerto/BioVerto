if (typeof dc === 'undefined')
    dc = {};
/* @param parent: the ID of the DOM element where the gauge will be hooked up into
 @param chartGroup: the group to which the gauge belongs to (determines when refreshing is done)
 */
dc.fgraph = function(parent) {
    var _fgraph = {}, // main object
            _parentID = parent, // keep track of the parent of an object
            _margins = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
    _nodeData, // current data used by node
            _edgeData, // current data used by edge
            _fCharge = -120, // charge parameter
            _nodeColorType = "cont", // is the coloring measure discrete? "cont" or "disc"
            _nodeColorScaleD = d3.scale.category20(), // colors to be used for nodes when nodeAccessor is discret
            _minNodeColor = "blue",
            _maxNodeColor = "red",
            _nodeColorScaleC = d3.scale.linear() // same for continous
            .range([_minNodeColor, _maxNodeColor])
            .interpolate(d3.interpolateHcl),
            _edgeColors = d3.scale.category20(), // colors to be used for edges
            _nodeLabelAccessor = function(d) {
                return "";
            },
            _nodeColorAccessor = function(d) {
                return 1;
            }, // node color accessor
            _edgeColorAccessor = function(d) {
                return 1;
            },
            _minNodeSize = 10,
            _maxNodeSize = 30,
            _nodeSizeAccessor = function(d) {
                return _minNodeSize;
            },
            _nodeSizeScale = d3.scale.linear()
            .domain([_minNodeSize, _minNodeSize])
            .range([_minNodeSize, _maxNodeSize]),
            _edgeWidthAccessor = function(d) { // edge color accessor
                return 2;
            }, // controlls the width of the link
            _weightAccessor = function(d) {
                return 2;
            }, // controlls the weight of the node
            _edgeWidthScale = d3.scale.linear().range([1, 10]),
            _linkDistance = 30, // link distance for force
            _linkStrength,
            _force, // force layout
            _svg, // svg element
            _link, // links
            _node, // nodes
            _blinks, // bundle links
            _transitionDuration = 750,
            _graph = {}, // data to be displayed
            _width = 960,
            _height = 600,
            _displayNames = true, // should we display names
            _dblclickHandler = function(d) { // handler for what happens under a dbouleclick
                // do nothing
            },
            _terminator; // not used, just to terminate list

    // partial redraw of node size
    function changeNodeSize() {
        // recompute the normalization
        _nodeSizeScale.domain(
                d3.extent(_nodeData,
                        function(d) {
                            return _nodeSizeAccessor(d.data);
                        }));
        _node.selectAll("circle")
                .attr("r", function(d) {
                    return _nodeSizeScale(_nodeSizeAccessor(d.data));
                });
    }
   
    // partial redraw for node colors
    function changeNodeColor() {
        if (_nodeColorType === "cont") {
            _nodeColorScaleC.domain(
                    d3.extent(_nodeData,
                            function(d) {
                                return _nodeColorAccessor(d.data);
                            }))
            _node.selectAll("circle")
                    .style("fill", function(d) {
                        return _nodeColorScaleC(_nodeColorAccessor(d.data));
                    });
        } else {
            _node.selectAll("circle")
                    .style("fill", function(d) {
                        return _nodeColorScaleD(_nodeColorAccessor(d.data));
                    });

        }
    }

    // we can initialize the links/nodes only when we have data
    function changeData(graph) {

        if (!_force)
            _force = d3.layout.force()
                    .charge(_fCharge)
                    .linkDistance(_linkDistance)
                    .size([_width, _height]);

        function zoom() {
            _svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        if (!_svg) {
            _svg = d3.select(_parentID)
                    .append("svg")
                    .attr("width", _width)
                    .attr("height", _height);

            _svg.append("rect")
                    .attr("width", _width)
                    .attr("height", _height)
                    .style("fill", "none")
                    .style("pointer-events", "all")
                    .call(d3.behavior.zoom().scaleExtent([.0625, 8]).on("zoom", zoom))

            _svg = _svg.append("g");
        }


        // wrap the info in graph so that force layout is happy
        _nodeData = graph.nodes.map(function(d, i) {
            d.index = i;
            return {
                data: d,
                weight: _weightAccessor(d)
            };
        });
        //console.log(_nodeData);
        _edgeData = graph.edges.map(function(d, i) {
            d.index = i;
            return {
                //  source: d.source,
                //  target: d.target,
                source: _nodeData[d.source.index],
                target: _nodeData[d.target.index],
                data: d.data,
                //value: d.value                
            };
        });
        //console.log(_edgeData);

        _force
                .nodes(_nodeData)
                .links(_edgeData)
                .start();

        _link = _svg.selectAll(".link")
                .data(_edgeData)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke", function(d) {
                    return _edgeColors(d.data);
                })
                .style("stroke-width", function(d) {
                    return _edgeWidthAccessor(d.data);
                });

        var drag = _force.drag()
                .on("dragstart", function(d) {
                    d.fixed = true;
                    d3.select(this).select("circle").classed("sticky", d.fixed);
                });

        _node = _svg.selectAll(".node")
                .data(_nodeData)
                .enter().append("g")
                .attr("class", "node")
                .call(drag)
                ;

        _node.append("circle")
                .attr("class", "fgraph-circle")
                .on("dblclick", function(d) {
                    console.log(d);
                            d.fixed = false;
                    d3.select(this).classed("sticky", d.fixed);
                    _force.start();
                });
        changeNodeSize();
        changeNodeColor();

        _node.append("title")
                .text(function(d) {
                    return d.name;
                });

        _node.append("text")
                .attr("class", "fgraph-text")
                .text(function(d) {
                    return _nodeLabelAccessor(d);
                });

        _force.on("tick", function() {
            _link.attr("x1", function(d) {
                return d.source.x;
            })
                    .attr("y1", function(d) {
                        return d.source.y;
                    })
                    .attr("x2", function(d) {
                        return d.target.x;
                    })
                    .attr("y2", function(d) {
                        return d.target.y;
                    });

            _node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        });
    }
 _fgraph .highlightNode=function(nodenum)
    {
        console.log(_svg.selectAll("circle").filter(function(d){return d.data.data.id===nodenum}));
        _svg.selectAll("circle").filter(function(d){return d.data.data.id===nodenum}).style("fill","red");
    }
    _fgraph.init = function(parent, data, width, height) {
        _parentID = parent;
        _fgraph.graphView(data)
                .resize(width, height);
        return _fgraph;
    }
    _fgraph.destroy = function()
    {
        $(_parentID).empty();
     }
    _fgraph.doRender = function() {
        // delete old content if present
        // d3.select(_parentID).select("svg").remove();

        _fgraph.doRedraw();

        return _fgraph;
    }

    _fgraph.updateEgdeStyle = function(style, fn) {
        _link.style(style, fn);
    }
    _fgraph.updateNodeStyle = function(style, fn) {
        _node.selectAll("circle").style(style, fn);
    }
    _fgraph.updateNodeAttr = function(style, fn) {
        _node.selectAll("circle").attr(style, fn);
    }

    _fgraph.doRedraw = function() {
        //need to include jquery for following line to work
        var parent = $(_parentID); //$(_parentID+"-inner").parent();
        _width = parent.width() - _margins.left - _margins.right;
        _height = parent.height() - _margins.top - _margins.bottom;
    }

    // should we display names for nodes?
    _fgraph.displayNames = function(_) {
        if (!arguments.length)
            return _displayNames;
        _displayNames = _;

        if (_displayNames)
            _node.append("text")
                    .text(function(d) {
                        return d.name;
                    });
        else {
            _node.selectAll("text").remove();
        }

        // _fgraph.doRedraw();
        return _fgraph;
    }

    // Change/get distance parametter of force
    _fgraph.distance = function(_) {
        if (!arguments.length)
            return _linkDistance;
        _linkDistance = _;
        _force.linkDistance(_linkDistance).start();
        return _fgraph;
    }

    // Change/get strength parameter of force
    _fgraph.strength = function(_) {
        if (!arguments.length)
            return _linkStrength;
        _linkStrength = _;
        _force.linkStrength(_linkStrength).start();
        return _fgraph;
    }

    // Change/get charge for graph
    _fgraph.charge = function(_) {
        if (!arguments.length)
            return _fCharge;
        _fCharge = _;
        _force.charge(_fCharge).start();
        return _fgraph;
    }


    // Change/get inner colors
    _fgraph.nodeColors = function(_) {
        if (!arguments.length)
            return _nodeColors;
        _nodeColors = _;
        _fgraph.updateNodeStyle("fill", _);
        return _fgraph;
    }

    _fgraph.edgeColors = function(_) {
        if (!arguments.length)
            return _edgeColors;
        _edgeColors = _;

        _fgraph.updateEgdeStyle("stroke", _);
        return _fgraph;
    }

    _fgraph.nodeColorAccessor = function(_) {
        if (!arguments.length)
            return _nodeColorAccessor;
        _nodeColorAccessor = _;
        return _fgraph;
    };

    _fgraph.edgeColorAccessor = function(_) {
        if (!arguments.length)
            return _edgeColorAccessor;
        _edgeColorAccessor = _;
        return _fgraph;
    };

    _fgraph.weightAccessor = function(_) {
        if (!arguments.length)
            return _weightAccessor;
        // TODO, enforce the changes
        _weightAccessor = _;
        return _fgraph;
    };

    // Change/get data
    _fgraph.graphView = function(_) {
        if (!arguments.length)
            return _graph;
        _graph = _;
        changeData(_graph);
        return _fgraph;
    };

    _fgraph.resize = function(width, height) {
        _width = width;
        _height = height;

        if (_svg)
            d3.select(_parentID)
                    .select("svg")
                    .attr("width", _width)
                    .attr("height", _height)
                    .select("rect")
                    .attr("width", _width)
                    .attr("height", _height)
                    ;

        if (_force)
            _force.size([width, height]).start();
        return _fgraph;
    };

    _fgraph.minEdgeWidth = function(_) {
        var range = _edgeWidthScale.range();
        if (!arguments.length)
            return range[0];

        range[0] = _;
        _edgeWidthScale.range(range);

        return _fgraph;
    };

    _fgraph.maxEdgeWidth = function(_) {
        var range = _edgeWidthScale.range();
        if (!arguments.length)
            return range[1];

        range[1] = _;
        _edgeWidthScale.range(range);

        return _fgraph;
    };

    _fgraph.nodeSizeAcessor = function(_) {
        _nodeSizeAccessor = (typeof _ === 'function') ? _ : function(d) {
            return _minNodeSize;
        };
        changeNodeSize();
    };

    _fgraph.minNodeSize = function(_) {
        _minNodeSize = (typeof _ === 'number') ? _ : 5;
        _nodeSizeScale.range([_minNodeSize, _maxNodeSize]);
        changeNodeSize();
    };

    _fgraph.maxNodeSize = function(_) {
        _maxNodeSize = (typeof _ === 'number') ? _ : 15;
        _nodeSizeScale.range([_minNodeSize, _maxNodeSize]);
        changeNodeSize();
    };

    _fgraph.nodeLabelAcessor = function(_) {
        _nodeLabelAccessor = (typeof _ === 'function') ? _ : function(d) {
            return "";
        };
        _node.selectAll("text")
                .text(function(d) {
                    return _nodeLabelAccessor(d.data);
                });
    };

    _fgraph.nodeColorAcessor = function(_) {
        _nodeColorAccessor = (typeof _ === 'function') ? _ : function(d) {
            return 1;
        };
        // if function and type defined is continous
        _nodeColorType = (typeof _ === 'function' && _.returnType === "number") ? "cont" : "disc";
        changeNodeColor();
        return _fgraph;
    };

    _fgraph.minNodeColor = function(_) {
        _minNodeColor = (typeof _ === 'string') ? _ : "blue";
        _nodeColorScaleC.range([_minNodeColor, _maxNodeColor]);
        changeNodeColor();
        return _fgraph;
    };

    _fgraph.maxNodeColor = function(_) {
        _maxNodeColor = (typeof _ === 'string') ? _ : "red";
        _nodeColorScaleC.range([_minNodeColor, _maxNodeColor]);
        changeNodeColor();
        return _fgraph;
    };

    _fgraph.dblclickHandler = function(_) {
        _dblclickHandler = (typeof _ === 'function') ? _ :
                function(d){};
 
        return _fgraph;
    }

    return _fgraph;
};
