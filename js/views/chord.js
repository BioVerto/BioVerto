if (typeof dc === 'undefined')
    dc = {};
/* @param parent: the ID of the DOM element where the gauge will be hooked up into
 @param chartGroup: the group to which the gauge belongs to (determines when refreshing is done)
 */
dc.chord = function(parent) {
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
            _svg, // svg element
            _node, // nodes
            _graph = {}, // data to be displayed
            _width = 960,
            _height = 600,
            _displayNames = true, // should we display names
            _weightAccessor = function(d) {
                return 2;
            },
            _ticks,
            _uniqueElements = [],
            _graphProperty = function(d) {
                return d.data["_0"];
            },
            _chord,
            _terminator; // not used, just to terminate list

    function redraw()
    {

        innerRadius = Math.min(_width - 60, _height - 40) * .41,
                outerRadius = innerRadius * 1.1;
        var fill = d3.scale.ordinal()
                .domain(d3.range(4))
                .range(["#000000", "#FFDD89", "#957244", "#F26223"]);
        d3.select(_parentID).select("svg")
                .attr("width", _width)
                .attr("height", _height);
        _svg.attr("width", _width)
                .attr("height", _height);

        _svg.attr("transform", "translate(" + _width / 2 + "," + (_height + 40) / 2 + ")");
        _svg.selectAll("path")
                .data(_chord.groups)
                .style("fill", function(d) {
                    return fill(d.index);
                })
                .style("stroke", function(d) {
                    return fill(d.index);
                })
                .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
        _ticks.data(_chord.groups)
                .data(groupTicks)
                .attr("transform", function(d) {
                    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                            + "translate(" + outerRadius + ",0)";
                });

        _ticks.append("line")
                .attr("x1", 1)
                .attr("y1", 0)
                .attr("x2", 5)
                .attr("y2", 0)
                .style("stroke", "#000");

        _ticks.selectAll("text")
                .attr("x", 8)
                .attr("dy", ".35em")
                .attr("transform", function(d) {
                    return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
                })
                .style("text-anchor", function(d) {
                    return d.angle > Math.PI ? "end" : null;
                })


        _svg.selectAll(".chord").selectAll("path")
                .data(_chord.chords)
                .attr("d", d3.svg.chord().radius(innerRadius))
                .style("fill", function(d) {
                    return fill(d.target.index);
                })
                .style("opacity", 1);
        function groupTicks(d) {
            var k = (d.endAngle - d.startAngle) / d.value;
            return d3.range(0, d.value, 1000).map(function(v, i) {
                return {
                    angle: d.startAngle / 2 + (d.endAngle) / 2,
                    label: (d.index < _nodeData.length) ? _nodeData[d.index].data.data.id : _uniqueElements[d.index],
                };
            });
        }

    }

    function changeData(graph) {
   
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
                source: _nodeData[d.source.index],
                target: _nodeData[d.target.index],
                data: d.data,
            };
        });
        var matrix = createUniqueList();
        _chord = d3.layout.chord()
                .padding(.005)
                .sortSubgroups(d3.descending)
                .matrix(matrix);
        _width = _width - 300;
        innerRadius = Math.min(_width, _height) * .41,
                outerRadius = innerRadius * 1.1;
        var fill = d3.scale.ordinal()
                .domain(d3.range(4))
                .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

        if (!_svg)
            _svg = d3.select(_parentID).append("svg")
                    .attr("width", _width)
                    .attr("height", _height)
                    .append("g")
                    .attr("transform", "translate(" + _width / 2 + "," + (_height + 40) / 2 + ")");

        _svg.append("g").selectAll("path")
                .data(_chord.groups)
                .enter().append("path")
                .style("fill", function(d) {
                    return fill(d.index);
                })
                .style("stroke", function(d) {
                    return fill(d.index);
                })
                .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
                .on("mouseover", fade(.1,true))
                .on("mouseout", fade(1,false));

        _ticks = _svg.append("g").selectAll("g")
                .data(_chord.groups)
                .enter().append("g").selectAll("g")
                .data(groupTicks)
                .enter().append("g")
                .attr("transform", function(d) {
                    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                            + "translate(" + outerRadius + ",0)";
                });

        _ticks.append("line")
                .attr("x1", 1)
                .attr("y1", 0)
                .attr("x2", 5)
                .attr("y2", 0)
                .style("stroke", "#000");

        _ticks.append("text")
                .attr("x", 8)
                .attr("dy", ".35em")
                .attr("transform", function(d) {
                    return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
                })
                .style("text-anchor", function(d) {
                    return d.angle > Math.PI ? "end" : null;
                })
                .text(function(d) {
                    return d.label;
                });
        _svg.append("g")
                .attr("class", "chord")
                .selectAll("path")
                .data(_chord.chords)
                .enter().append("path")
                .attr("d", d3.svg.chord().radius(innerRadius))
                .style("fill", function(d) {
                    return fill(d.target.index);
                })
                .style("opacity", 1);
        function groupTicks(d) {
            var k = (d.endAngle - d.startAngle) / d.value;
            return d3.range(0, d.value, 1000).map(function(v, i) {
                return {
                    angle: d.startAngle / 2 + (d.endAngle) / 2,
                    label: (d.index < _nodeData.length) ? _nodeData[d.index].data.data.id : _uniqueElements[d.index],
                };
            });
        }
        function fade(opacity,flg) {
            return function(g, i) {
                var highlightAreas = [];
                highlightAreas.push(i);
                _svg.selectAll(".chord path")
                        .filter(function(d) {
                     
                            if ((d.source.index == i || d.target.index == i))
                            {
                                if(d.source.index ==i)
                                {
                                    highlightAreas.push(d.target.index)
                                }  
                                else
                                {
                                    highlightAreas.push(d.source.index)   
                                }
                            }
                            return d.source.index != i && d.target.index != i;
                        })
                        .transition()
                        .style("opacity", opacity);
                if(flg){
                _svg.select("g:nth-child(2)").selectAll("text").filter(function(d, j) {
                    return highlightAreas.indexOf(j)!==-1
                }).style("fill", "red");
            }
            else{
                _svg.select("g:nth-child(2)").selectAll("text").filter(function(d, j) {
                    return highlightAreas.indexOf(j)!==-1
                }).style("fill", "black");
            }
            };
        }

        return _fgraph;
    }
         

    function createUniqueList() {
        _uniqueElements = [];
        for (var i = 0; i < _nodeData.length; i++) {
            _uniqueElements.push(_nodeData[i])
        }
        for (var i = 0; i < _nodeData.length; i++) {
            if (_uniqueElements.indexOf(_graphProperty(_nodeData[i].data)) === -1)
            {
                _uniqueElements.push(_graphProperty(_nodeData[i].data));
            }
        }
        var matrix = new Array();
        for (var i = 0; i < _uniqueElements.length; i++) {
            matrix.push(Array.apply(null, new Array(_uniqueElements.length)).map(Number.prototype.valueOf, 0))
        }

        for (var i = 0; i < _nodeData.length; i++) {

            for (var j = _nodeData.length; j < _uniqueElements.length; j++) {
                if (_uniqueElements[j] === _graphProperty(_uniqueElements[i].data))
                {
                    matrix[i][j] = 1;
                    matrix[j][i] = 1;

                }
                else
                {
                    matrix[i][j] = 0;
                }
            }

        }
        return matrix;
    }


    _fgraph.init = function(parent, data, width, height) {
        _parentID = parent;
        _width = width;
        _height = height;

        _fgraph.graphView(data)
                .resize(width, height);
        return _fgraph;
    }
    _fgraph.destroy = function()
    {
        $(_parentID).empty();

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
        redraw();
        return _fgraph;
    };


    return _fgraph;
};
