if (typeof dc === 'undefined')
    dc = {};

/* @param parent: the ID of the DOM element where the gauge will be hooked up into
   @param chartGroup: the group to which the gauge belongs to (determines when refreshing is done)
*/
dc.cgraph = function(parent) {
    var _cgraph = {}, // main object
    _parentID = parent, // keep track of the parent of an object
    _margins = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
    },
    _nodeColorScaleD = d3.scale.category20(), // colors to be used for nodes when nodeAccessor is discret
    _edgeColors = d3.scale.category20(), // colors to be used for edges
    _nodeColorAccessor = function(d) {
	return 1;
    }, // node color accessor
    _edgeColorAccessor = function(d) {
	return 1;
    }, // edge color accessor    
    _cluster,
    _bundle,
    _svg, // svg element
    _rootGElement, //root g element under svg
    _line, // path
    _node, // nodes
    _links, // links
    _graph = {}, // data to be displayed
    _root, // root node of the cluster
    _diameter = 360,
    _radius = _diameter / 2,
    _textRadius = 40,
    _innerRadius = _radius - _textRadius;
    
    // we can initialize the links/nodes only when we have data
    //do we need to call changeData whenever DoReDraw is called??!!
    function changeData(graph) {

        //Deleted .value() because it has no effect on cluster layout
        //https://github.com/mbostock/d3/wiki/cluster-Layout#wiki-value
	if(!_cluster)
	    _cluster = d3.layout.cluster()
            .size([360, _innerRadius])
            .sort(null);
	
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
	
        if(!_node || !_link) {
            var circularData = parserForBundle(graph);
            var nodes = _cluster.nodes(_root = packageHierarchy(circularData)),
                links = packageImports(nodes);

            _link = _rootGElement.selectAll(".link-cgraph")
                .data(_bundle(links))
                .enter().append("path")
                .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
                .attr("class", "link-cgraph")
                .attr("d", _line);

            _node = _rootGElement.selectAll(".node-cgraph")
                .data(nodes.filter(function(n) { return !n.children; }))
                .enter().append("text")
                .attr("class", "node-cgraph")
                .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
                .attr("dy", ".31em")
                .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")" + (d.x < 180 ? "" : "rotate(180)"); })
                .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                .text(function(d) { return d.key; })
                .on("mouseover", mouseovered)
                .on("mouseout", mouseouted);
        
            _node.append("title")
               .text(function(d) {
                   return d.name;
               });	
        }
       //TODO: Commenting out for time being
       //Need to figure out how to handle color change for cgraph
       //changeNodeColor();
       
      
    }

    function mouseovered(d) {
	_node
            .each(function(n) { n.target = n.source = false; });

	_link
            .classed("link-cgraph--target", function(l) { if (l.target === d) return l.source.source = true; })
            .classed("link-cgraph--source", function(l) { if (l.source === d) return l.target.target = true; })
            .filter(function(l) { return l.target === d || l.source === d; })
            .each(function() { this.parentNode.appendChild(this); });

	_node
            .classed("node-cgraph--target", function(n) { return n.target; })
            .classed("node-cgraph--source", function(n) { return n.source; });
    }

    function mouseouted(d) {
	_link
            .classed("link-cgraph--target", false)
            .classed("link-cgraph--source", false);

	_node
            .classed("node-cgraph--target", false)
            .classed("node-cgraph--source", false);
    }


    //partial redraw for node colors
    function changeNodeColor() {
        _node.style("fill", function(d) {
            return _nodeColorScaleD(_nodeColorAccessor(d.data));
        });
    }
    
    /* Function to redraw the part that changes the geometry */
    function changeLayout(){
	if (!_cluster) return;

        //Deleted .value() because it has no effect on cluster layout
        //https://github.com/mbostock/d3/wiki/cluster-Layout#wiki-value
	_cluster.size([360, _innerRadius]);

	_rootGElement.selectAll(".link-cgraph")
            .attr("d", _line);
	
	_rootGElement.selectAll(".node-cgraph")
            .data( _cluster.nodes(_root).filter(function(n) { return !n.children; }) )
            .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")" + (d.x < 180 ? "" : "rotate(180)"); })
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; });
    }
    
    _cgraph.init = function(parent,data,width,height) {
	_diameter = Math.min(width,height);
	_parentID = parent;
	_cgraph.graphView(data)
            .resize(width,height);
	return _cgraph;
    };

    _cgraph.doRender = function() {
	_cgraph.doRedraw();
        return _cgraph;
    };

    _cgraph.updateEgdeStyle = function(style,fn){
	_link.style(style, fn);              
    };

    _cgraph.doRedraw = function() {
	//need to include jquery for following line to work
	var parent = $(_parentID); //$(_parentID+"-inner").parent();
	_width = parent.width() - _margins.left - _margins.right;
	_height = parent.height() - _margins.top - _margins.bottom;

	_diameter = Math.Min(_width,_height);
	_svg.attr("width", _diameter)
	    .attr("height", _diameter);

	_radius = _diameter / 2,
	_innerRadius = _radius - _textRadius;
	
	_cluster.size([360, _innerRadius])
            .sort(null)
            .value(function(d) { return d.size; });
    };

    // Change/get inner colors
    _cgraph.nodeColors = function(_) {
	if (!arguments.length) return _nodeColors;
	_nodeColors = _;
	return _cgraph;
    };

    _cgraph.edgeColors = function(_) {
	if (!arguments.length) return _edgeColors;
	_edgeColors = _;
	_cgraph.updateEgdeStyle("stroke",_);
	return _cgraph;
    };

    _cgraph.nodeColorAccessor = function(_) {
	if (!arguments.length) return _nodeColorAccessor;
	_nodeColorAccessor = _;
        //TODO: Commenting out for time being
        //Need to figure out how to handle color change for cgraph
        //changeNodeColor();
        return _cgraph;
    };

    _cgraph.edgeColorAccessor = function(_) {
	if (!arguments.length) return _edgeColorAccessor;
	_edgeColorAccessor = _;
	return _cgraph;
    };

    // Change/get data
    _cgraph.graphView = function(_) {
	if (!arguments.length) return _graph;
	_graph = _;
	changeData(_graph);
	return _cgraph;
    };
    
    _cgraph.destroy = function() {
        $(_parentID).empty();
    };
     
    //Resize is called everytime height, width is changed
    _cgraph.resize = function(width,height) {
	_diameter = Math.min(width-40,height-40);
	_radius = _diameter / 2,
	_innerRadius = _radius - _textRadius;
	if (_svg) {
	    _svg.attr("width", width)
		.attr("height", height);

	    _svg.select("g")
		.attr("transform", "translate(" + (_radius+20) + "," + (_radius+20) + ")");    
	    
	    changeLayout();
	}
	
	return _cgraph;
    };

    _cgraph.textRadius = function(_) {
	if (!arguments.length) return _textRadius;
	_textRadius = _;
        
        _innerRadius = _diameter/2 - _textRadius;
	changeLayout();
	
	return _cgraph;
    };

    return _cgraph;

};

//Parser for circular layout.
function parserForBundle(graph){
    var cGraphNodes = [];
    var nodes = graph.nodes;
    nodes.forEach(function(d){ 
	var imports = [];
	var num = (d.data.id);
	var links=graph.edges;
	for(var i=0; i<links.length; i++){
	    if(links[i].source.data.id === num){
		imports.push(String(links[i].target.data.id));  
	    }
	}
	cGraphNodes.push({
            name: d.data.id,
            data: d.data,
            imports: imports
	});
    });
    return cGraphNodes;
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

