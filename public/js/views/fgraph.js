if (typeof dc === 'undefined')
    dc = {};
/**
 *
 *
 * @returns a force layout object
 */
dc.fgraph = function() {

    var ColorTypes = {CONT:0,DISC:1};

    var defaultAccessor = function(val){return{
        getOne:function(){return val;},
        getRange:function(){return {min:val ,max:val}},
        cacheAllValues:function(){},
        deleteCache:function(){}
        }
    };

    var defaultFilterFunction = function() {
        return function(d,i){ return true;}
    };

    var     _fgraph = {}, // main object
            _parentID, // keep track of the parent of an object
            _margins = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            _nodeData, // current data used by node
            _edgeData, // current data used by edge
            _fCharge = -120, // charge parameter
            _nodeColorType = ColorTypes.CONT, // is the coloring measure discrete? "cont" or "disc"
            _nodeColorScaleD = d3.scale.category20(), // colors to be used for nodes when nodeAccessor is discret
            _minNodeColor = "#9674cf",
            _maxNodeColor = "#CC0033",
            _nodeColorScaleC = d3.scale.linear() // same for continous
            .range([_minNodeColor, _maxNodeColor])
            .interpolate(d3.interpolateHcl),
            _edgeColorType = ColorTypes.CONT, // is the coloring measure discrete? "cont" or "disc"
            _edgeColorScaleD = d3.scale.category20(), // colors to be used for nodes when nodeAccessor is discret
            _minEdgeColor = "#9674cf",
            _maxEdgeColor = "#CC0033",
            _edgeColorScaleC = d3.scale.linear() // same for continous
            .range([_minEdgeColor, _maxEdgeColor])
            .interpolate(d3.interpolateHcl),
            _edgeColors = d3.scale.category20(), // colors to be used for edges
            _translate = 0,
            _scale =1,
            _nodeLabelAccessor = defaultAccessor(""),
            _nodeColorAccessor = defaultAccessor(1), // node color accessor
            _edgeColorAccessor = defaultAccessor(1),
            _minNodeSize = 10,
            _maxNodeSize = 15,
            _nodeSizeAccessor = defaultAccessor(_minNodeSize),
            _nodeSizeScale = d3.scale.linear()
            .domain([_minNodeSize, _minNodeSize])
            .range([_minNodeSize, _maxNodeSize]),
            _minEdgeWidth = 2,
            _maxEdgeWidth = 10,
            _edgeWidthAccessor =defaultAccessor(_minEdgeWidth),
            _edgeWidthScale = d3.scale.linear()
            .domain([_minEdgeWidth, _minEdgeWidth])
            .range([_minEdgeWidth, _maxEdgeWidth]),
            // controlls the width of the link
            _weightAccessor = defaultAccessor(2), // controlls the weight of the node
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
            _nodeFilterFunction = defaultFilterFunction,
             _edgeFilterFunction = defaultFilterFunction,
            _dblclickHandler = function(d) { // handler for what happens under a dbouleclick
                // do nothing
            },
            _theta = 0.8,
            _nodeToolTip = function(d){
                return getAllAttributesValue(_graph.nodeAccessors,"Node",d);
            },
            _edgeToolTip = function(d){
                return getAllAttributesValue(_graph.edgeAccessors,"Edge",d);
            },
            _terminator; // not used, just to terminate list


    // Gets the value of attributes of node for the hover over information
    /***
     *
     * @param dataAccessors : Acessor Functions
     * @param type : Node or Edge
     * @param d
     * @returns {string}
     */
    function  getAllAttributesValue (dataAccessors,type,d){
        var result =type+" Info <br/>";
        for(var fn in dataAccessors)
        {
            result += fn+" : "+ dataAccessors[fn].getOne(d.index)+"<br/>";
        }
        return result;
    }

    // partial redraw of node size
    function changeNodeSize() {
        // recompute the normalization
        var range = _nodeSizeAccessor.getRange();
        _nodeSizeScale.domain([range.min,range.max])
        _nodeSizeAccessor.cacheAllValues();
        _node.selectAll("circle")
                .attr("r", function(d) {
                    return _nodeSizeScale(_nodeSizeAccessor.getOne(d.index));
                });
        _nodeSizeAccessor.deleteCache();
    }
    function changeEdgeWidth() {
        // recompute the normalization
        var range = _edgeWidthAccessor.getRange();
        _edgeWidthScale.domain([range.min,range.max])
        _edgeWidthAccessor.cacheAllValues();
        _edgeWidthScale.domain([range.min,range.max]);
        _link.style("stroke-width", function(d) {
            return  _edgeWidthScale(_edgeWidthAccessor.getOne(d.index));
        });
        _edgeWidthAccessor.deleteCache();
    }
    // partial redraw for node colors
    function changeNodeColor() {
        _nodeColorAccessor.cacheAllValues();

        if (_nodeColorType === ColorTypes.CONT) {
            var range = _nodeColorAccessor.getRange();
            _nodeColorScaleC.domain([range.min,range.max]);
            _node.selectAll("circle")
                    .style("fill", function(d) {
                        return _nodeColorScaleC(_nodeColorAccessor.getOne(d.index));
                    });
        } else {
            _node.selectAll("circle")
                    .style("fill", function(d) {
                        return _nodeColorScaleD(_nodeColorAccessor.getOne(d.index));
                    });

        }
        _nodeColorAccessor.deleteCache();
    }
    function changeEdgeColor() {
        _edgeColorAccessor.cacheAllValues();
        if (_edgeColorType === ColorTypes.CONT) {
            var range = _nodeColorAccessor.getRange();
            _edgeColorScaleC.domain([range.min,range.max]);
            _link.style("stroke", function(d) {
                return _edgeColorScaleC(_edgeColorAccessor.getOne(d.index));
            })

        } else {
            _link.style("stroke", function(d) {
                return _edgeColorScaleD(_edgeColorAccessor.getOne(d.index));
            })

        }
        _edgeColorAccessor.deleteCache();
    }
    function changeNodeLabel() {
        _nodeLabelAccessor.cacheAllValues();
        _node.selectAll("text")
            .text(function(d) {
                return _nodeLabelAccessor.getOne(d.index);
            });
        _nodeLabelAccessor.deleteCache();
    }

    /**
     *
     * @param graph
     */
    function initData(graph) {
        if (!_force)
            _force = d3.layout.force()
                    .charge(_fCharge)
                    .theta(_theta)
                    .linkDistance(_linkDistance)
                    .size([_width, _height]);

        /**
         *
         */
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
        _nodeData = graph.getNodeData();
        _edgeData = graph.getEdgeData();
        _nodeData = _nodeData.map(function(d, i) {
            return {
                index : d.id,
                weight:1
            };

        });
        _edgeData = _edgeData.map(function(d, i) {
            f = {
                //  source: d.source,
                //  target: d.target,
                source: _nodeData[d.Source],
                target: _nodeData[d.Target],
                index:i
                //value: d.value
            };

            return f;
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
    }


    /**
     *
     */
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
                .attr("class", "link")
                .on("mouseover", function (d,i){
                                dc.tooltip.html(_edgeToolTip(d)).show();
                            })
                .on("mouseout", function (d,i){
                                dc.tooltip.hide();
                            });
        _newLinks = _svg.select(".links").selectAll(".link")
        _newNodes = _svg.select(".nodes").selectAll(".node")
                .data(_nodeData.filter(_nodeFilterFunction))
                .enter().append("g")
                .attr("class", "node")
                .call(drag)
                .on("mouseover", function (d,i){
                                dc.tooltip.html(_nodeToolTip(d)).show();
                            })
                .on("mouseout", function (d,i){
                                dc.tooltip.hide();
                            });
        _svg.select(".nodes").selectAll(".node")
                .data(_nodeData.filter(_nodeFilterFunction))
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
                    return _nodeLabelAccessor.getOne(d);
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
        _force.resume();      
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
        _linkLabels.attr("transform", function(d) {
                return "translate(" + d.source.x + "," + d.source.y + ")rotate("+(Math.atan2((d.source.x-d.target.x), (d.source.y-d.target.y)) * 180 / Math.PI + 180)+")";
            });
    }
    _fgraph.nodeFilterFunction = function(_)
    {
        var results = _graph.applyNodeFilter(_);
        _nodeFilterFunction = function(d,i){
                return results.indexOf(d.index)>-1;
            }
        drawData();
    }
    _fgraph.edgeFilterFunction = function(_)
    {
        var results = _graph.applyEdgeFilter(_);
        _edgeFilterFunction = function(d,i){
            return results.indexOf(d.index)>-1;
        }
        drawData();
    }
    _fgraph.init = function(parent, graph, width, height,state) {
        _parentID = parent;
        _fgraph.graphView(graph)
                .resize(width, height);
        _graph = graph;
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
        initData(_);
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
    _fgraph.updateEgdeStyle = function(style, fn) {
        _link.style(style, fn);
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


    _fgraph.weightAccessor = function(_) {
        if (!arguments.length)
            return _weightAccessor;
        // TODO, enforce the changes
        _weightAccessor = _;
        return _fgraph;
    };


    _fgraph.nodeSizeAccessor = function(_) {
        if(!_){
            _ = defaultAccessor(_minNodeSize)
        }
        _nodeSizeAccessor =  _ ;
        changeNodeSize();
    };
    _fgraph.edgeWidthAccessor = function(_) {
        if(!_){
            _ = defaultAccessor(_minEdgeWidth)
        }
        _edgeWidthAccessor = (typeof _ === 'object') ? _ : function(d) {
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

    _fgraph.nodeLabelAccessor = function(_) {
        if (!_){
            _ =defaultAccessor("");
        }
        _nodeLabelAccessor = _;
        changeNodeLabel();
    };

    _fgraph.nodeColorAccessor = function(_) {
        if (!_){
            _ =defaultAccessor(1);
        }
        _nodeColorAccessor = _;
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
        if (!_){
            _ =defaultAccessor(1);
        }
        _edgeColorAccessor = _ ;
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
     _fgraph.stopAnimation = function()
     {
         _force.stop();
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
