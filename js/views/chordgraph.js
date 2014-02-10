if (typeof dc === 'undefined')
    dc = {};

/* @param parent: the ID of the DOM element where the gauge will be hooked up into
   @param chartGroup: the group to which the gauge belongs to (determines when refreshing is done)
   */
dc.chordgraph = function(parent) {
  var _chordGraph = {}, // main object
    _parentID = parent, // keep track of the parent of an object
    _margins = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    //_fCharge = -120, // charge parameter
    _nodeTicksColors = d3.scale.category20(), // colors to be used for nodes
    _edgeColors = d3.scale.category20(), // colors to be used for edges
    _nodeTicksColorAccessor = function(d) {
      return 1;
    }, // node color accessor
    _edgeColorAccessor = function(d) {
      return 1;
    }, // edge color accessor
    _edgeWidthAccessor = function(d) {
      return 2;
    }, // controlls the width of the link
    _weightAccessor = function(d) {
      return 2;
    }, // controlls the weight of the node
    _edgeWidthScale = d3.scale.linear().range([1, 10]),
    _chord,
    _svg, // svg element
    _rootGElement, //root g element under svg
    _arcs, // the arcs shown in chord graph
    _transitionDuration = 750,
    _width = 480,
    _height = 250,
    _innerRadius = Math.min(_width, _height) * .41,
    _outerRadius = _innerRadius * 1.1,
    _fill = d3.scale.ordinal()
            .domain(d3.range(4))
            .range(["#000000", "#FFDD89", "#957244", "#F26223"]),
//     _matrix =  [
//   [11975,  5871, 8916, 2868],
//   [ 1951, 10048, 2060, 6171],
//   [ 8010, 16145, 8090, 8045],
//   [ 1013,   990,  940, 6907]
// ],
    _matrix,
    _displayNames = true, // should we display names
    _terminator; // not used, just to terminate list

  // we can initialize the links/nodes only when we have data
  //do we need to call changeData whenever DoReDraw is called??!!
  function changeData(graph) {

    createMatrix(graph.edges);

    if(!_chord)
      _chord = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(_matrix);
   
    if (!_svg) 
      _svg = d3.select(_parentID)
        .append("svg")
        .attr("width",_width)
        .attr("height",_height);

    if(!_rootGElement)
      _rootGElement = _svg.append("g")
                      .attr("transform", "translate(" + _width / 2 + "," + _height + ")");         
    
    _nodeTicksGroup = _rootGElement.append("g");

    _nodeTicksGroup.selectAll("path")
      .data(_chord.groups)
      .enter().append("path")
      .style("fill", function(d) { return _fill(d.index); })
      .style("stroke", function(d) { return _fill(d.index); })      
      .on("mouseover", fade(.1))
      .on("mouseout", fade(1));

    _nodeTicksGroup.selectAll("path")
      .attr("d", d3.svg.arc().innerRadius(_innerRadius).outerRadius(_outerRadius))

    _nodeTicks = _rootGElement.append("g").selectAll("g")
            .data(_chord.groups)
            .enter().append("g").selectAll("g")
            .data(groupTicks)
            .enter().append("g")
            .attr("transform", function(d) {
              return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                  + "translate(" + _outerRadius + ",0)";
            });

    if (_displayNames) {
       _nodeTicks.append("line")
          .attr("x1", 1)
          .attr("y1", 0)
          .attr("x2", 5)
          .attr("y2", 0)
          .style("stroke", "#000");

      _nodeTicks.append("text")
          .attr("x", 6)
          .attr("dy",".35em")
          .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
          .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
          .text(function(d) { return d.label });

      _nodeTicks.append("title")
          .text(function(d) {
              return d.name;
          });
    }

    _arcs = _rootGElement.append("g")
            .attr("class", "chord");

    _arcs.selectAll("path")
        .data(_chord.chords)
        .enter().append("path")
        .attr("d", d3.svg.chord().radius(_innerRadius))
        .style("fill", function(d) { return _fill(d.target.index); })
        .style("opacity", 1)
        .style("fill-opacity", .67)
        .style("stroke", "#000")
        .style("stroke-width", ".5px");

    // Returns an array of tick angles and labels, given a group.
    function groupTicks(d) {
      var k = (d.endAngle - d.startAngle) / d.value;
      return d3.range(0, d.value, 1000).map(function(v, i) {
        return {
          angle: v * k + d.startAngle,
          label: i++
        };
      });
    }

    // Returns an event handler for fading a given chord group.
    function fade(opacity) {
      return function(g, i) {
        _svg.selectAll(".chord path")
            .filter(function(d) { return d.source.index != i && d.target.index != i; })
          .transition()
            .style("opacity", opacity);
      };
    }
  }



  _chordGraph.init = function(parent,data,width,height) {
    _width = width;
    _height = height;
    _parentID = parent;
    _chordGraph.graphView(data)
           .resize(width,height);
    return _chordGraph;
  };

  _chordGraph.doRender = function() {
    // delete old content if present
    // d3.select(_parentID).select("svg").remove();

    _chordGraph.doRedraw();

    return _chordGraph;
  };

  _chordGraph.updateEgdeStyle = function(style,fn){
    _nodeTicksGroup.style(style, fn);              
  };

  _chordGraph.doRedraw = function() {
    //need to include jquery for following line to work
    var parent = $(_parentID); //$(_parentID+"-inner").parent();
    _width = parent.width() - _margins.left - _margins.right;
    _height = parent.height() - _margins.top - _margins.bottom;

    _svg
      .attr("width", _width)
      .attr("height", _height);
  };

  // should we display names for nodes?
  _chordGraph.displayNames = function(_) {
    if (!arguments.length) return _displayNames;
    _displayNames = _;

    if (_displayNames)
      _nodeTicks.append("text")
        .text(function(d) {
          return d.name;
        });
    else {
      _nodeTicks.selectAll("text").remove();
    }

    // _chordGraph.doRedraw();
    return _chordGraph;
  };

  // Change/get inner colors
  _chordGraph.nodeColors = function(_) {
    if (!arguments.length) return _nodeTicksColors;
    _nodeTicksColors = _;
    return _chordGraph;
  };

  _chordGraph.edgeColors = function(_) {
    if (!arguments.length) return _edgeColors;
    _edgeColors = _;
    _chordGraph.updateEgdeStyle("stroke",_);
    return _chordGraph;
  };

  _chordGraph.nodeColorAccessor = function(_) {
    if (!arguments.length) return _nodeTicksColorAccessor;
    _nodeTicksColorAccessor = _;
    return _chordGraph;
  };

  _chordGraph.edgeColorAccessor = function(_) {
    if (!arguments.length) return _edgeColorAccessor;
    _edgeColorAccessor = _;
    return _chordGraph;
  };

  _chordGraph.weightAccessor = function(_) {
    if (!arguments.length) return _weightAccessor;
    // TODO, enforce the changes
    _weightAccessor = _;
    return _chordGraph;
  };

  // Change/get data
  _chordGraph.graphView = function(_) {
    if (!arguments.length) return _graph;
    _graph = _;
    changeData(_graph);
    return _chordGraph;
  };

  _chordGraph.resize = function(width,height) {
    _width = width;
    _height = height;
    
    if (_svg) {
      _svg.attr("width", _width)
        .attr("height", _height);

      _innerRadius = Math.min(_width, _height) * .41,
      _outerRadius = _innerRadius * 1.1,

      _nodeTicksGroup.selectAll("path")
        .attr("d", d3.svg.arc().innerRadius(_innerRadius).outerRadius(_outerRadius));

      _nodeTicks.attr("transform", function(d) {
              return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                  + "translate(" + _outerRadius + ",0)";
            });

      _arcs.selectAll("path").attr("d", d3.svg.chord().radius(_innerRadius)) 

      _rootGElement.attr("transform", "translate(" + _width/2 + "," + _height/2 + ")");
    }
    //console.log(_svg.attr(_width));
    return _chordGraph;
  };

  _chordGraph.minEdgeWidth = function(_) {
    var range = _edgeWidthScale.range();
    if (!arguments.length) return range[0];

    range[0] = _;
    _edgeWidthScale.range(range);

    return _chordGraph;
  };

  _chordGraph.maxEdgeWidth = function(_) {
    var range = _edgeWidthScale.range();
    if (!arguments.length) return range[1];

    range[1] = _;
    _edgeWidthScale.range(range);

    return _chordGraph;
  };

  function createMatrix(links) {

    var dict = {};
    
    var addPair = function (_key, _value) {
        dict[_key] = _value;
    };
    var giveValue = function (_key) {
        return dict[_key];
    };

    _matrix = new Array(links.length);

    for (var i = 0; i < links.length; i++) {
        _matrix[i] = new Array(links.length);
    }


    for (var i = 0; i < links.length; i++) {
        for(var j=0;j<links.length;j++) {
            _matrix[i][j] = 0;
        }
    }
    var keyCount = 0,m = 0,n=0;
    for (var i = 0; i < links.length; i++) {
        m = giveValue(links[i].source.data.id);
        if(m == undefined) {
            m = keyCount;
            addPair(links[i].source.data.id,keyCount++);
        }
        n = giveValue(links[i].target.data.id); 
        if(n == undefined) {
            n = keyCount;
            addPair(links[i].target.data.id,keyCount++);
        }
        _matrix[m][n]++;
        //console.log(_matrix[m][n]++);
    }
    //console.log("matrix");
    //console.log(matrix);
  }
  return _chordGraph;

}