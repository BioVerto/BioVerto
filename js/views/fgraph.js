/* Implementation of a graph visualizer

   

   API follows DS conventions.
*/

// create the dc object if it does not exist
if (typeof dc=='undefined')
    dc = {};

/* @param parent: the ID of the DOM element where the gauge will be hooked up into
   @param chartGroup: the group to which the gauge belongs to (determines when refreshing is done)
   */
dc.fgraph = function (parent){
    var _fgraph = {}, // main object
    _parentID = parent,     // keep track of the parent of an object
    _margins = {top:0, right: 0, bottom: 0, left: 0},
    _fCharge = -120, // charge parameter
    _color = d3.scale.category20(), // colors to be used for nodes
    _linkDistance = 30, // link distance for force
    _linkStrength,
    _force, // force layout
    _svg, // svg element
    _link, // links
    _node, // nodes
    _transitionDuration = 750,
    _data = {}, // data to be displayed
    _width = 200,
    _height = 200,
    _displayNames = true, // should we display names
    _terminator; // not used, just to terminate list
    
    // we can initialize the links/nodes only when we have data
    function changeData(graph){
	_data = graph;

	if (!_svg)
	    _svg = d3.select(_parentID)
	    .append("svg");

	if (!_force)
	    _force = d3.layout.force()
	    .charge(_fCharge)
	    .linkDistance(_linkDistance);

	_force
	    .nodes(graph.nodes)
	    .links(graph.links)
	    .start();

	_link = _svg.selectAll(".link")
	    .data(graph.links)
	    .enter().append("line")
	    .attr("class", "link")
	    .style("stroke-width", function(d) { return 5*d.value; });
	
	_node = _svg.selectAll(".node")
	    .data(graph.nodes)
	    .enter().append("g")
	    .attr("class", "node")
	    .call(_force.drag)
	    .on("mousedown", function(d) {
		d.fixed = true;
		d3.select(this).classed("sticky", true);
	    })
	    .on("dblclick", function(d) {
		d.fixed = false;
		d3.select(this).classed("sticky", false);
	    });

	_node.append("circle")
	    .attr("r", 5)
	    .style("fill", function(d) { return _color(d.group); })
	
	_node.append("title")
	    .text(function(d) { return d.name; });

	if (_displayNames)
	    _node.append("text")
	    .text(function(d) { return d.name; });
	
	_force.on("tick", function() {
	    _link.attr("x1", function(d) { return d.source.x; })
		    .attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });
	    
	    _node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	});
    }


    _fgraph.doRender = function (){
        // delete old content if present
        // d3.select(_parentID).select("svg").remove();

	_fgraph.doRedraw();

	return _fgraph;
    }
    
    
    _fgraph.doRedraw = function (){
	var parent = $(_parentID); //$(_parentID+"-inner").parent();
        _width = parent.width()-_margins.left-_margins.right;
        _height = parent.height()-_margins.top-_margins.bottom;

	_svg
	    .attr("width", _width)
	    .attr("height", _height); 

	_force.size([_width, _height])
	    .start();
    }

    // should we display names for nodes?
    _fgraph.displayNames = function(_){
        if (!arguments.length) return _displayNames;
	_displayNames=_;

	if (_displayNames)
	    _node.append("text")
	    .text(function(d) { return d.name; });
	else {
	    _node.selectAll("text").remove();
	}

	// _fgraph.doRedraw();
        return _fgraph;
    }    

    // Change/get distance parametter of force
    _fgraph.distance = function(_){
        if (!arguments.length) return _linkDistance;
        _linkDistance=_;
	_force.linkDistance(_linkDistance).start();
        return _fgraph;
    }

    // Change/get strength parameter of force
    _fgraph.strength = function(_){
        if (!arguments.length) return _linkStrength;
        _linkStrength=_;
	_force.linkStrength(_linkStrength).start();
        return _fgraph;
    }

    // Change/get charge for graph
    _fgraph.charge = function(_){
        if (!arguments.length) return _fCharge;
        _fCharge=_;
	_force.charge(_fCharge).start();
        return _fgraph;
    }


    // Change/get inner colors
    _fgraph.colors = function(_){
        if (!arguments.length) return _colors;
        _colors=_;
        return _fgraph;
    }

    // Change/get data
    _fgraph.data = function(_){
        if (!arguments.length) return _data;
        _data=_;
	changeData(_data);
        return _fgraph;
    }


    return _fgraph;


}
