if (typeof dc === 'undefined')
    dc = {};

/* @param parent: the ID of the DOM element where the gauge will be hooked up into
   @param chartGroup: the group to which the gauge belongs to (determines when refreshing is done)
   */
dc.cgraph = function(parent) {
  var _fgraph = {}, // main object
    _parentID = parent, // keep track of the parent of an object
    _margins = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    //_fCharge = -120, // charge parameter
    _nodeColors = d3.scale.category20(), // colors to be used for nodes
    _edgeColors = d3.scale.category20(), // colors to be used for edges
    _nodeColorAccessor = function(d) {
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
    _cluster,
    _bundle,
    _svg, // svg element
    _rootGElement, //root g element under svg
    _line, // links
    _node, // nodes
    _transitionDuration = 750,
    _graph = {}, // data to be displayed
    _diameter =360,
    _radius = _diameter / 2,
    _innerRadius = _radius - 10,
    _displayNames = true, // should we display names
    _terminator; // not used, just to terminate list

  // we can initialize the links/nodes only when we have data
  //do we need to call changeData whenever DoReDraw is called??!!
  function changeData(graph) {

    if(!_cluster)
      _cluster = d3.layout.cluster()
        .size([360, _innerRadius])
        .sort(null)
        .value(function(d) { return d.size; });
    
    if(!_bundle)    
      _bundle = d3.layout.bundle();

    if(!_line)
      _line = d3.svg.line.radial()
        .interpolate("bundle")
        .tension(.85)
        .radius(function(d) { return d.y; })
        .angle(function(d) { return d.x / 180 * Math.PI; });

    if (!_svg) 
      _svg = d3.select(_parentID)
        .append("svg")
        .attr("width",_diameter)
        .attr("height",_diameter);

    if(!_rootGElement)
      _rootGElement = _svg.append("g")
        .attr("transform", "translate(" + _radius + "," + _radius + ")");          
    
    

    var circularData = parserForBundle(graph);
    //console.log("circular Data");
    //console.log(circularData);
    var nodes = _cluster.nodes(packageHierarchy(circularData)),
        links = packageImports(nodes);

    _link = _rootGElement.selectAll(".link")
              .data(_bundle(links))
              .enter().append("path")
              .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
              .attr("class", "link")
              .attr("d", _line);

    _node = _rootGElement.selectAll(".node")
            .data(nodes.filter(function(n) { return !n.children; }))
            .enter().append("g")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
            .append("text")
            .attr("fill", "red")
            .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
            .attr("dy", ".31em")
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
            .text(function(d) { return d.key; });

    _node.append("title")
          .text(function(d) {
              return d.name;
          });

    if (_displayNames)
      _node.append("text")
        .text(function(d) {
          return d.name;
        });

  }

  function mouseovered(d) {
    _node
        .each(function(n) { n.target = n.source = false; });

    _link
        .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
        .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
        .filter(function(l) { return l.target === d || l.source === d; })
        .each(function() { this.parentNode.appendChild(this); });

    _node
        .classed("node--target", function(n) { return n.target; })
        .classed("node--source", function(n) { return n.source; });
  }

  function mouseouted(d) {
    _link
        .classed("link--target", false)
        .classed("link--source", false);

    _node
        .classed("node--target", false)
        .classed("node--source", false);
  }

  _fgraph.init = function(parent,data,width,height) {
      var diameter = minDiameter(width,height);
      console.log("diameter = " + diameter);
      _parentID = parent;
      _fgraph.graphView(data)
             .resize(diameter);
      return _fgraph;
  };

  _fgraph.doRender = function() {
    // delete old content if present
    // d3.select(_parentID).select("svg").remove();

    _fgraph.doRedraw();

    return _fgraph;
  };

  _fgraph.updateEgdeStyle = function(style,fn){
    _link.style(style, fn);              
  };

  _fgraph.doRedraw = function() {
    //need to include jquery for following line to work
    var parent = $(_parentID); //$(_parentID+"-inner").parent();
    _width = parent.width() - _margins.left - _margins.right;
    _height = parent.height() - _margins.top - _margins.bottom;

    _svg
      .attr("width", _diameter)
      .attr("height", _diameter);

    _radius = _diameter / 2,
    _innerRadius = _radius - 10;
    
    _cluster.size([360, _innerRadius])
            .sort(null)
            .value(function(d) { return d.size; });
  };

  //helper function for circular layout. Returns the minimum of the 2 parameters. Used in deciding the cluster layout size
  function minDiameter(w,h){
    if (w < h) {
      return w;
    }
    else {
      return h;
    }
  }

  // should we display names for nodes?
  _fgraph.displayNames = function(_) {
    if (!arguments.length) return _displayNames;
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
  };

  // Change/get inner colors
  _fgraph.nodeColors = function(_) {
    if (!arguments.length) return _nodeColors;
    _nodeColors = _;
    return _fgraph;
  };

  _fgraph.edgeColors = function(_) {
    if (!arguments.length) return _edgeColors;
    _edgeColors = _;
    _fgraph.updateEgdeStyle("stroke",_);
    return _fgraph;
  };

  _fgraph.nodeColorAccessor = function(_) {
    if (!arguments.length) return _nodeColorAccessor;
    _nodeColorAccessor = _;
    return _fgraph;
  };

  _fgraph.edgeColorAccessor = function(_) {
    if (!arguments.length) return _edgeColorAccessor;
    _edgeColorAccessor = _;
    return _fgraph;
  };

  _fgraph.weightAccessor = function(_) {
    if (!arguments.length) return _weightAccessor;
    // TODO, enforce the changes
    _weightAccessor = _;
    return _fgraph;
  };

  // Change/get data
  _fgraph.graphView = function(_) {
    if (!arguments.length) return _graph;
    _graph = _;
    changeData(_graph);
    return _fgraph;
  };

  _fgraph.resize = function(diameter) {
    _diameter = diameter;
    if (_cluster) {
          
      _radius = _diameter / 2,
      _innerRadius = _radius - 10;
    
      _cluster.size([360, _innerRadius])
              .sort(null)
              .value(function(d) { return d.size; });
    }
    
    if (_svg) {
      _svg.attr("width", _diameter)
        .attr("height", _diameter);

      _svg.select("g")
        .attr("transform", "translate(" + _radius + "," + _radius + ")");    
    }
    //console.log(_svg.attr(_width));
    return _fgraph;
  };

  _fgraph.minEdgeWidth = function(_) {
    var range = _edgeWidthScale.range();
    if (!arguments.length) return range[0];

    range[0] = _;
    _edgeWidthScale.range(range);

    return _fgraph;
  };

  _fgraph.maxEdgeWidth = function(_) {
    var range = _edgeWidthScale.range();
    if (!arguments.length) return range[1];

    range[1] = _;
    _edgeWidthScale.range(range);

    return _fgraph;
  };

  return _fgraph;

}

//Parser for circular layout.
function parserForBundle(graph){
  var circ_graph=[];
  var nod= graph.nodes;
  nod.forEach(function(d){ 
    var imports=[];
    var num=(d.data.id);
    var lin=graph.edges;
    for(var i=0; i<lin.length;i++){
      if(lin[i].source.data.id==num){
        imports.push(String(lin[i].target.data.id));  
      }
    }
    circ_graph.push({
        name: d.data.id,
        imports: imports
    });
  });
  //console.log("circ_graph");
  //console.log(circ_graph);
  return circ_graph;
}

//Helper function for circular layout
function packageHierarchy(classes) {
  var map = {};

  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    //console.log(node);
    return node;
  }

  classes.forEach(function(d) {
    find(d.name, d);
  });

  return map[""];
}

//Another helper function for circular layout. Return a list of imports for the given array of nodes.
function packageImports(nodes) {
  var map = {},
      imports = [];

  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.name] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.imports) d.imports.forEach(function(i) {
      imports.push({source: map[d.name], target: map[i]});
    });
  });

  return imports;
}
