if (typeof dc === 'undefined')
    dc = {};
/* @param parent: the ID of the DOM element where the gauge will be hooked up into
 @param chartGroup: the group to which the gauge belongs to (determines when refreshing is done)
 */
dc.chord2 = function(parent) {
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
    _terminator; // not used, just to terminate list


   

    // we can initialize the links/nodes only when we have data
    function changeData(graph) {

       
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

       
       

    _fgraph.init = function(parent, data, width, height) {
        _parentID = parent;
        _fgraph.graphView(data)
                .resize(width, height);
        return _fgraph;
    }
    _fgraph.destroy = function()
    {
        $(_parentID).empty();
       _svg.remove();
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


    return _fgraph;
};
