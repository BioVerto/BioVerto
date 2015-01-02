if (typeof dc === 'undefined')
    dc = {};

dc.fgraph = function(parent) {

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
    var getAllAttributesValue = function(dataAccessors,type,d){
        var result =type+" Info <br/>";
        for(var fn in dataAccessors)
        {
            result += fn+" : "+ dataAccessors[fn].getOne(d.index)+"<br/>";
        }
        return result;
    }
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
        _nodeHighlightColor = "blue",
        _edgeHighlightColor = "blue",
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
        _textGraphicArray = [],
        _textContainer = new PIXI.DisplayObjectContainer(),
        _nodeToolTip = function(d){
            return getAllAttributesValue(_graph.nodeAccessors,"Node",d);
        },
        _edgeToolTip = function(d){
            return getAllAttributesValue(_graph.edgeAccessors,"Edge",d);
        },
        _renderer,
        _stage,
        _circles =[],
        _graphicContainer,
        _screen,
        _edges =  new PIXI.Graphics(),
        _worker,
        _terminator; // not used, just to terminate list


    function changeEdgeWidth() {
        // recompute the normalization
        var range = _edgeWidthAccessor.getRange();
        _edgeWidthScale.domain([range.min,range.max])
        _edgeWidthAccessor.cacheAllValues();
        _edgeWidthScale.domain([range.min,range.max]);
        _edgeData.forEach(function(d){
            d.width = _edgeWidthScale(_edgeWidthAccessor.getOne(d.index));
        });

        assignLocations();
        _edgeWidthAccessor.deleteCache();
    }

    function changeEdgeColor() {
        _edgeColorAccessor.cacheAllValues();
        if (_edgeColorType === ColorTypes.CONT) {
             var range = _edgeColorAccessor.getRange();
            _edgeColorScaleC.domain([range.min,range.max]);
            _edgeData.forEach(function(d){
                d.color = _edgeColorScaleC(_edgeColorAccessor.getOne(d.index)).replace("#","0x");
            });

        } else {
            _edgeData.forEach(function(d){
                d.color = _edgeColorScaleD(_edgeColorAccessor.getOne(d.index)).replace("#","0x");
            });


        }
        _edgeColorAccessor.deleteCache();
    }
    function changeNodeLabel() {
        _nodeLabelAccessor.cacheAllValues();
        _textGraphicArray.forEach(function(d){
            d.setText(_nodeLabelAccessor.getOne(d.index));
        })

        _nodeLabelAccessor.deleteCache();
        drawGraph();
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
        drawGraph();
    }
    _fgraph.edgeFilterFunction = function(_)
    {
        var results = _graph.applyEdgeFilter(_);
        _edgeFilterFunction = function(d,i){
            return results.indexOf(d.index)>-1;
        }
        drawGraph();
    }
    _fgraph.nodeHighlightColor = function(_) {
        _nodeHighlightColor = (typeof _ === 'string') ? _ : "blue";
        changeNodeColor();
        return _fgraph;
    };
    _fgraph.edgeHighlightColor = function(_) {
        _edgeHighlightColor = (typeof _ === 'string') ? _ : "blue";
        changeEdgeColor();
        return _fgraph;
    };
    _fgraph.init = function(parent, graph, width, height,state) {
        _parentID = parent;
        _graph = graph;
        initGraph(graph);
        _fgraph.resize(width, height);
        _graph = graph;

        drawGraph();

        if(state!==undefined)
        {
            _fgraph.resumeState(state);
        }
        return _fgraph;
    }
    _fgraph.destroy = function()
    {

        for (var i = _graphicContainer.children.length - 1; i >= 0; i--) {
            _graphicContainer.children[i].interactive = false;
            _graphicContainer.removeChild(_graphicContainer.children[i]);
        };

        for (var i = _stage.children.length - 1; i >= 0; i--) {
            _stage.children[i].interactive = false;
            _stage.removeChild(_stage.children[i]);
        };
        _stage.interactionManager.removeEvents();
        _stage.interactionManager = null;
        $(_parentID).remove();
        _force.nodes([]).links([]);
        _force.stop();
         _force = null;
        _renderer = null;;
        _stage = null;
        _graphicContainer = null;
        _edges= null;
        _screen = null;
        _edgeData = null;
        _nodeData = null;
        _fgraph = null;

    }

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
    function drawGraph() {
        _edges.clear();
        _edgeData.forEach(function(d){
            _edges.lineStyle(d.width, d.color,.4);
            _edges.moveTo(d.source.x,d.source.y)
            _edges.lineTo(d.target.x, d.target.y);
        });
        _edges.endFill();
        _renderer.render(_stage);
        _screen.hitArea = _stage.getBounds();
    }



    // partial redraw for node colors
    function changeNodeColor() {
        _nodeColorAccessor.cacheAllValues();

        if (_nodeColorType === ColorTypes.CONT) {
            var range = _nodeColorAccessor.getRange();
            _nodeColorScaleC.domain([range.min,range.max]);
            _nodeData.forEach(function(d,i){
               debugger;
                d.color = !_nodeFilterFunction(i)? "0xff0000" : _nodeColorScaleC(_nodeColorAccessor.getOne(d.index)).replace("#","0x");
                d.clear();
                d.beginFill(d.color);
                d.drawCircle(0, 0, d.size);
            })

        } else {
            _nodeData.forEach(function(d){
                d.color = _nodeColorScaleD(_nodeColorAccessor.getOne(d.index));
            })
        }
        _nodeColorAccessor.deleteCache();
        drawGraph();
    }
    //Initialize Graph and D3 Worker
    function initGraph(graph) {

        _nodeData = graph.getNodeData();
        _edgeData = graph.getEdgeData();
        _force = new D3Worker({nodes:_nodeData,edges:_edgeData});

        initPIXI();

        _force.on("tick",assignLocations);

    }

    var initPIXI = function(){
    // Basic config For PIXI
    var rendererOptions = {
        antialiasing:true,
        transparent:false,
        resolution:1
    };

    _renderer = new PIXI.autoDetectRecommendedRenderer(_width, _height,rendererOptions);
   //Ugly needs to go
     document.getElementById(_parentID.slice(1, _parentID.length)).appendChild(_renderer.view);

    _stage = new PIXI.Stage(0xFFFFFF, true);
    _stage.interactive = true;

    //For Panning
    _screen = new PIXI.Graphics();
    _screen.interactive = true;
    _screen.mousedown = function(e){
        _screen.isDragging = true;
        _screen.prevMouseX = e.global.x;
        _screen.prevMouseY = e.global.y;
    };
    _screen.mouseup = function(){
        _screen.isDragging = false;
    };

    _screen.mouseupoutside = function(){_screen.isDragging = false;};

    _screen.mousemove = function(e){
        if(_screen.isDragging)
        {
            _graphicContainer.x += (e.global.x - _screen.prevMouseX ) ;
            _graphicContainer.y += (e.global.y - _screen.prevMouseY ) ;
            _textContainer.x += (e.global.x - _screen.prevMouseX ) ;
            _textContainer.y += (e.global.y - _screen.prevMouseY ) ;

            _screen.prevMouseX = e.global.x;
            _screen.prevMouseY = e.global.y;
            _renderer.render(_stage);
        }

    };

    // Bind to the mousewheel for zooming
    $(_parentID).bind('mousewheel', function(e) {
        if (e.originalEvent.wheelDelta / 120 > 0) {

            _graphicContainer.scale.x *= 1.1;
            _graphicContainer.scale.y *= 1.1;
            _textContainer.scale.x *= 1.1;
            _textContainer.scale.y *= 1.1;

        }
        else {

            _graphicContainer.scale.x *= .9;
            _graphicContainer.scale.y *= .9;

            _textContainer.scale.x *= .9;
            _textContainer.scale.y *= .9;

        }
        _renderer.render(_stage);
    });

    _graphicContainer = new PIXI.DisplayObjectContainer();
    _graphicContainer.interactive = true;
    _graphicContainer.addChild(_edges);

    _stage.addChild(_screen);
    _stage.addChild(_graphicContainer);
    _stage.addChild(_textContainer);

    // Nodes are PIXI Graphic objects. All Properties and event handlers are set below.
    _nodeData = _nodeData.map(function(d, i) {
            // Each visual circle is a PIXI Graphics
            var nodeGraphic = new PIXI.Graphics();
            nodeGraphic.drawCircle(0, 0, 10);
            nodeGraphic.interactive = true;
            nodeGraphic.hitArea = new PIXI.Circle(0,0,10);
            nodeGraphic.index = i;
            nodeGraphic.weight = 1;
            nodeGraphic.size = 5;
            nodeGraphic.color = "0x9674cf";

            nodeGraphic.mousedown = function(e){
                nodeGraphic.isDragging = true;
                nodeGraphic.prevMouseX = e.global.x;
                nodeGraphic.prevMouseY = e.global.y;
                nodeGraphic.prevX = nodeGraphic.x;
                nodeGraphic.prevY = nodeGraphic.y;
            };

            nodeGraphic.mouseup = function(){
                nodeGraphic.isDragging = false;
                nodeGraphic.fixed = false;
            };

            nodeGraphic.mouseupoutside = function(){nodeGraphic.isDragging = false;
                nodeGraphic.fixed = false;
            };

            nodeGraphic.mousemove = function(e){
                if(nodeGraphic.isDragging){
                    nodeGraphic.px= nodeGraphic.x;
                    nodeGraphic.py= nodeGraphic.y;

                    nodeGraphic.x =nodeGraphic.prevX + (e.global.x - nodeGraphic.prevMouseX ) ;
                    nodeGraphic.y =nodeGraphic.prevY + (e.global.y - nodeGraphic.prevMouseY ) ;

                    nodeGraphic.fixed = true;
                    _force.updateLocation(i,nodeGraphic.x,nodeGraphic.y);
                    _force.resume();

                }
            };
            nodeGraphic.x = i;
            nodeGraphic.y = i;

            //Node Label default configs
            var tmpText = new PIXI.Text("")
            tmpText.index = i;
            tmpText.setStyle({font:"bold 12px Arial" });

            _textGraphicArray.push(tmpText);
            _graphicContainer.addChild(nodeGraphic);
            _textContainer.addChild(tmpText);

            return nodeGraphic;

        });

        //A representation of edges in the main thread, used from drawing edges
    _edgeData = _edgeData.map(function(d, i) {
        var temp = {
            source: _nodeData[d.Source],
            target: _nodeData[d.Target],
            index: i,
            width: 5
        };
        return temp
    });
    //Finally Render the stage
    _renderer.render(_stage);


}

    //assign new locations to nodes in graph.
    function assignLocations(locations) {
        if (locations) {
        _nodeData.forEach(function (d, i) {
            d.x = locations.x[i];
            d.y = locations.y[i];

            _textGraphicArray[i].x = locations.x[i];
            _textGraphicArray[i].y = locations.y[i];
        })
        drawGraph();
    }


    }
    // partial redraw of node size
    function changeNodeSize() {
        // recompute the normalization
        var range = _nodeSizeAccessor.getRange();
        _nodeSizeScale.domain([range.min,range.max])

        _nodeSizeAccessor.cacheAllValues();

        //Redraw all graphics
        _nodeData.forEach(function(d) {
            d.size =  _nodeSizeScale(_nodeSizeAccessor.getOne(d.index));
            d.clear();
            d.beginFill(d.color);
            d.drawCircle(0, 0, d.size);
        });

        _nodeSizeAccessor.deleteCache();
        _renderer.render(_stage);
    }
    //To resize the graph
    _fgraph.resize = function(width, height) {

        _width = width;
        _height = height;

        //Set the new bounds for the screen which handles zoom and pan
        _screen.hitArea = _stage.getBounds();

        _force.size([width, height]);
        _force.start();


        _renderer.resize(width,height);
        _renderer.render(_stage);

        return _fgraph;
    };

    return _fgraph;
};
