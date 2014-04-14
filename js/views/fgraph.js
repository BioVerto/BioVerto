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
            _minNodeColor = "#9674cf",
            _maxNodeColor = "#CC0033",
            _nodeColorScaleC = d3.scale.linear() // same for continous
            .range([_minNodeColor, _maxNodeColor])
            .interpolate(d3.interpolateHcl),
            _edgeColorType = "cont", // is the coloring measure discrete? "cont" or "disc"
            _edgeColorScaleD = d3.scale.category20(), // colors to be used for nodes when nodeAccessor is discret
            _minEdgeColor = "#9674cf",
            _maxEdgeColor = "#CC0033",
            _edgeColorScaleC = d3.scale.linear() // same for continous
            .range([_minEdgeColor, _maxEdgeColor])
            .interpolate(d3.interpolateHcl),
            _edgeColors = d3.scale.category20(), // colors to be used for edges
            _translate = 0,
            _scale =1,
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
            _maxNodeSize = 15,
            _nodeSizeAccessor = function(d) {
                return _minNodeSize;
            },
            _nodeSizeScale = d3.scale.linear()
            .domain([_minNodeSize, _minNodeSize])
            .range([_minNodeSize, _maxNodeSize]),
            _minEdgeWidth = 2,
            _maxEdgeWidth = 10,
            _edgeWidthAccessor = function(d) { // edge color accessor
                return 2;
            },
            _edgeWidthScale = d3.scale.linear()
            .domain([_minEdgeWidth, _minEdgeWidth])
            .range([_minEdgeWidth, _maxEdgeWidth]),
            // controlls the width of the link
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
            _linkLabels, //link Labels
            _graph = {}, // data to be displayed
            _width = 960,
            _height = 600,
            _displayNames = true, // should we display names
            _nodeFilterFunction = function(d, i) {
                return true;
            },
             _edgeFilterFunction = function(d, i) {
                return true;
            },
            _dblclickHandler = function(d) { // handler for what happens under a dbouleclick
                // do nothing
            },
            _indexFunction = function(d) {
                return d.data.index
            },
            _theta = 0.8,
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
    function changeEdgeWidth() {
        // recompute the normalization
        var extent = d3.extent(_edgeData,
                function(d) {
                    return _edgeWidthAccessor(d);
                })
        if (extent[0] === "-")
        {
            extent[0] = 0;
        }
        _edgeWidthScale.domain(extent);
        _link.style("stroke-width", function(d) {
            return  _edgeWidthScale(_edgeWidthAccessor(d));
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
    function changeEdgeColor() {
        if (_edgeColorType === "cont") {
            var extent = d3.extent(_edgeData,
                    function(d) {
                        return _edgeColorAccessor(d);
                    })
            if (extent[0] === "-")
            {
                extent[0] = 0;
            }
            _edgeColorScaleC.domain(extent);
            _link.style("stroke", function(d) {
                return _edgeColorScaleC(_edgeColorAccessor(d));
            })

        } else {
            _link.style("stroke", function(d) {
                return _edgeColorScaleD(_edgeColorAccessor(d));
            })

        }
    }


    function initData(graph) {
        if (!_force)
            _force = d3.layout.force()
                    .charge(_fCharge)
                    .theta(_theta)
                    .linkDistance(_linkDistance)
                    .size([_width, _height]);

        function zoom() {
            _translate = d3.event.translate;
            _scale = d3.event.scale;
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
            _svg.append("g")
                    .attr("class", "links");
            _svg.append("g")
                    .attr("class", "nodes");
        }

        // wrap the info in graph so that force layout is happy
        _nodeData = graph.nodes.map(function(d, i) {
            d.index = i;
            return {
                data: d,
                weight: _weightAccessor(d)
            };
        });
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
        _force
                .nodes(_nodeData)
                .links(_edgeData)
                .start();
        _force.on("tick", assignLocations);

    }
    function assignLocations()
    {
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
//            _linkLabels.attr("transform", function(d) {
//                return "translate(" + d.source.x + "," + d.source.y + ")rotate("+(Math.atan2((d.source.x-d.target.x), (d.source.y-d.target.y)) * 180 / Math.PI + 180)+")";
//            });
    }
    function drawData() {

        var drag = _force.drag()
                   .on("dragstart", function(d) {
                    d.fixed = true;
                    d3.select(this).select("circle").classed("sticky", d.fixed);
                });
          _force
                .nodes(_nodeData.filter(_nodeFilterFunction))
                .links(_edgeData.filter(function(d) {
                    return _nodeFilterFunction(d.target) && _nodeFilterFunction(d.source)&&_edgeFilterFunction(d);
                }));
          _force.resume();      
        _svg.select(".links").selectAll(".link")
                .data(_edgeData.filter(function(d) {
                    return _nodeFilterFunction(d.target) && _nodeFilterFunction(d.source)&&_edgeFilterFunction(d)
                }))
                .exit()
                .transition()
                .remove();
        _newLinks = _svg.select(".links").selectAll(".link")
                .data(_edgeData.filter(function(d) {
                    return _nodeFilterFunction(d.target) && _nodeFilterFunction(d.source)&&_edgeFilterFunction(d)
                }))
                .enter();
        _newLinks.append("line")
                .attr("class", "link");
        _newLinks = _svg.select(".links").selectAll(".link")
        _newNodes = _svg.select(".nodes").selectAll(".node")
                .data(_nodeData.filter(_nodeFilterFunction), _indexFunction)
                .enter().append("g")
                .attr("class", "node")
                .call(drag)
        _svg.select(".nodes").selectAll(".node")
                .data(_nodeData.filter(_nodeFilterFunction), _indexFunction)
                .exit()
                .transition()
                .remove();

        _newNodes.append("circle")
                .attr("class", "fgraph-circle")
                .on("dblclick", function(d) {
                    d.fixed = false;
                    d3.select(this).classed("sticky", d.fixed);
                    _force.start();
                });
        _newNodes.append("title")
                .text(function(d) {
                    return d.name;
                });

        _newNodes.append("text")
                .attr("class", "fgraph-text")
                .text(function(d) {
                    return _nodeLabelAccessor(d);
                });
        _node = _svg.selectAll(".node");
        _link = _svg.selectAll(".link");
        _linkLabels = _svg.select(".links").selectAll("text")
        changeNodeSize();
        changeNodeColor();
        changeNodeLabel();
        changeEdgeColor();
        changeEdgeWidth();
        assignLocations();
    }
    function changeNodeLabel() {
        _node.selectAll("text")
                .text(function(d) {
                    return _nodeLabelAccessor(d.data);
                });
    }
    function changeEdgeLabel() {
        _svg.select("links").selectAll("text")
                .text(function(d) {
                    return _edgeLabelAccessor(d);
                });
        assignEdgeLabelLocation();
    }
    function assignEdgeLabelLocation()
    {

    }
    _fgraph.nodeFilterFunction = function(_)
    {
        _nodeFilterFunction = function(d){return _(d.data);};
        drawData();
    }
    _fgraph.edgeFilterFunction = function(_)
    {
        _edgeFilterFunction = _;
        drawData();
    }
    _fgraph.init = function(parent, data, width, height,state) {
        _parentID = parent;
        _fgraph.graphView(data)
                .resize(width, height);
        drawData();
        if(state!==undefined)
        {
            _fgraph.resumeState(state);
        }
        return _fgraph;
    }
    _fgraph.destroy = function()
    {
        $(_parentID).empty();
    }
    _fgraph.graphView = function(_) {
        if (!arguments.length)
            return _graph;
        _graph = _;
        initData(_graph);
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
    _fgraph.nodeData = function()
    {
        return _nodeData;
    }
    _fgraph.edgeData = function()
    {
        return _edgeData;
    }
    _fgraph.highlightNode = function(nodenum)
    {
        _svg.selectAll("circle").filter(function(d) {
            return d.data.data.id === nodenum
        }).style("fill", "red");
    }
    _fgraph.updateEgdeStyle = function(style, fn) {
        _link.style(style, fn);
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


    _fgraph.edgeColors = function(_) {
        if (!arguments.length)
            return _edgeColors;
        _edgeColors = _;

        _fgraph.updateEgdeStyle("stroke", _);
        return _fgraph;
    }




    _fgraph.weightAccessor = function(_) {
        if (!arguments.length)
            return _weightAccessor;
        // TODO, enforce the changes
        _weightAccessor = _;
        return _fgraph;
    };

    _fgraph.nodeColorAccessor = function(_) {
        if (!arguments.length)
            return _nodeColorAccessor;
        _nodeSizeAccessor = (typeof _ === 'function') ? _ : function(d) {
            return 1;
        };
        _nodeColorAccessor = _;
        return _fgraph;
    };
    _fgraph.nodeSizeAcessor = function(_) {
        _nodeSizeAccessor = (typeof _ === 'function') ? _ : function(d) {
            return _minNodeSize;
        };
        changeNodeSize();
    };
    _fgraph.edgeWidthAcessor = function(_) {
        _edgeWidthAccessor = (typeof _ === 'function') ? _ : function(d) {
            return _minEdgeWidth;
        };
        changeEdgeWidth();
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
    _fgraph.minEdgeWidth = function(_) {
        _minEdgeWidth = (typeof _ === 'number') ? _ : 2;
        _edgeWidthScale.range([_minEdgeWidth, _maxEdgeWidth]);
        changeEdgeWidth();
    };

    _fgraph.maxEdgeWidth = function(_) {
        _maxEdgeWidth = (typeof _ === 'number') ? _ : 10;
        _edgeWidthScale.range([_minEdgeWidth, _maxEdgeWidth]);
        changeEdgeWidth();
    };

    _fgraph.nodeLabelAcessor = function(_) {
        _nodeLabelAccessor = (typeof _ === 'function') ? _ : function(d) {

            return "";
        };
        changeNodeLabel();
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
    _fgraph.edgeColorAccessor = function(_) {
        _edgeColorAccessor = (typeof _ === 'function') ? _ : function(d) {
            return 1;
        };
        // if function and type defined is continous
        _edgeColorType = (typeof _ === 'function' && _.returnType === "number") ? "cont" : "disc";
        changeEdgeColor();
        return _fgraph;
    };

    _fgraph.minEdgeColor = function(_) {
        _minEdgeColor = (typeof _ === 'string') ? _ : "blue";
        _edgeColorScaleC.range([_minEdgeColor, _maxEdgeColor]);
        changeEdgeColor();
        return _fgraph;
    };

    _fgraph.maxEdgeColor = function(_) {
        _maxEdgeColor = (typeof _ === 'string') ? _ : "red";
        _edgeColorScaleC.range([_minEdgeColor, _maxEdgeColor]);
        changeEdgeColor();
        return _fgraph;
    };

    _fgraph.dblclickHandler = function(_) {
        _dblclickHandler = (typeof _ === 'function') ? _ :
                function(d) {
                };
        return _fgraph;
    }
     _fgraph.nodeAttrExtent = function(_) {
      var range = d3.extent(_nodeData, function(d) {
                            return _(d.data);
                        });                        
        return range;
    }
     _fgraph.edgeAttrExtent = function(_) {
       var range = d3.extent(_edgeData,_);
       if(range[0]==='-')
       {
           range[0] = "0"; 
       };
          
        return range;
    }
    
    _fgraph.getState = function() {
        var size = _nodeData.length;
        var x = [];
        var y = [];
        var px = [];
        var py = [];
        
        var fixed = [];
        for (i = 0; i < size; i++)
        {
            x.push(_nodeData[i].x);
            y.push(_nodeData[i].y);
            px.push(_nodeData[i].px);
            py.push(_nodeData[i].py);
            
            fixed.push (_nodeData[i].fixed);
        }
        return {alpha: _force.alpha(), x: x, y: y,px: px, py: py,fixed:fixed,translate:_translate,scale:_scale};
    };
    _fgraph.resumeState = function(_) {
        var size = _nodeData.length;
        var x = _.x;
        var y = _.y;
        var px = _.px;
        var py = _.py;
        
        var fixed = _.fixed;
       
        for (i = 0; i < size; i++)
        {
         _nodeData[i].x = x[i];
         _nodeData[i].y = y[i];
         _nodeData[i].px = px[i];
         _nodeData[i].py = py[i];
         
         _nodeData[i].fixed= fixed[i];
      
        }
      
 _svg.select(".nodes").selectAll(".node").select("circle").classed("sticky",function(d){return d.fixed})
  _svg.attr("transform", "translate(" +_.translate + ")scale(" + _.scale + ")");      
        assignLocations();
         _force.alpha(_.alpha);
     
    };
    
    return _fgraph;
};
