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
            _maxNodeSize = 15,
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
            _graph = {}, // data to be displayed
            _width = 960,
            _height = 600,
            _displayNames = true, // should we display names
            _filterFunction = function(d, i) {
                return true;
            }, //function(d,i){return true;},
            _dblclickHandler = function(d) { // handler for what happens under a dbouleclick
                // do nothing
            },
            _circles = new PIXI.DisplayObjectContainer(),
            _stage,
            _renderer,
            worker,
            _indexFunction = function(d) {
                return d.data.index
            },
            _theta = 0.8,
            _terminator; // not used, just to terminate list

    // partial redraw of node size
    function changeNodeSize() {
//        // recompute the normalization
//        _nodeSizeScale.domain(
//                d3.extent(_nodeData,
//                        function(d) {
//                            return _nodeSizeAccessor(d.data);
//                        }));
//        _node.selectAll("circle")
//                .attr("r", function(d) {
//                    return _nodeSizeScale(_nodeSizeAccessor(d.data));
//                });
    }

    // partial redraw for node colors
    function changeNodeColor() {
//        if (_nodeColorType === "cont") {
//            _nodeColorScaleC.domain(
//                    d3.extent(_nodeData,
//                            function(d) {
//                                return _nodeColorAccessor(d.data);
//                            }))
//            _node.selectAll("circle")
//                    .style("fill", function(d) {
//                        return _nodeColorScaleC(_nodeColorAccessor(d.data));
//                    });
//        } else {
//            _node.selectAll("circle")
//                    .style("fill", function(d) {
//                        return _nodeColorScaleD(_nodeColorAccessor(d.data));
//                    });
//
//        }
    }


    function initData(graph) {
        var tc = null
        _renderer = PIXI.autoDetectRenderer(_width, _height);
        document.getElementById(_parentID.slice(1, _parentID.length)).appendChild(_renderer.view);
        _stage = new PIXI.Stage(0xFF0000, true);
        _stage.interactive = true;
        _circles.interactive = true;
       var graphics = new PIXI.Graphics();
       graphics.beginFill(0xFFFFFF);
       graphics.moveTo(0,0);
        // draw a rectangle
      graphics.drawRect(0, 0, _width, _height);
      var _rect = new PIXI.Sprite(graphics.generateTexture());
            _rect.interactive = true;
            _rect.x = -10;
            _rect.y = -10;
            
            _rect.mousedown =_rect.touchstart = function(data)
		{
			// stop the default event...
			data.originalEvent.preventDefault();
                        
			this.data = data;
			this.alpha = 0.9;
			this.dragging = true;
                        this.orgX = _circles.x;
                        this.orgY = _circles.y;
                        this.curX = data.global.x;
                        this.curY = data.global.y;
                        
		};

		
		_rect.mouseup = _rect.mouseupoutside = _rect.touchend = _rect.touchendoutside = function(data)
		{
			this.alpha = 1
			this.dragging = false;
			this.data = null;
                      
                         _renderer.render(_stage);  
                };

		
		_rect.mousemove = _rect.touchmove = function(data)
		{
			if(this.dragging)
			{
				var newPosition = this.data.getLocalPosition(this.parent);
				_circles.x =this.orgX+  data.global.x - this.curX ;
				_circles.y = this.orgY+   data.global.y -this.curY; 
                                 _renderer.render(_stage);  
			}
		}

           _stage.addChild(_rect);
           
        _stage.addChild(_circles);
 
       
        $(_parentID).bind('mousewheel', function(e){
        if(e.originalEvent.wheelDelta/120  > 0) {
           console.log("up")
              _circles.scale.x+=.1;
              _circles.scale.y+=.1;
        }
        else{
        _circles.scale.x-=.1;
              _circles.scale.y-=.1;
              
          }
            _renderer.render(_stage);
       
    });
     
        var md = function(data){
         this.data = data;
        
         this.dragging = this.data.getLocalPosition(this.parent);
        worker.forceStop(); 
//         this.mouseup = this.mouseupoutside = mu;
//            this.orgX = this.x;
//        this.orgY = this.y;
//        this.curX = data.global.x;
//        this.curY = data.global.y;   
//        this.dragging = true;
//        this.data = data;
//worker.fixNode({idx:_circles.children.indexOf(this),state:true}); 
    //console.log("circle number md "+_circles.children.indexOf(this)+ "x: " +(this.orgX +data.global.x -this.curX)+"y: "+(this.orgY +data.global.y -this.curY));
      //    console.log();
    }
    var mm = function(data)
    {
        if(this.dragging)
	{
                var newPosition = this.data.getLocalPosition(this.parent);
                this.position.x += (newPosition.x - this.dragging.x);
                this.position.y += (newPosition.y - this.dragging.y);
                this.dragging = newPosition;
              _renderer.render(_stage);
          //worker.dragNode({nodeNum:_circles.children.indexOf(this),x:this.position.x,y:this.position.y });
                // worker.dragNode({nodeNum:_circles.children.indexOf(this),x: this.orgX +data.global.x -this.curX ,y: this.orgY +data.global.y -this.curY}); 
//	 console.log("circle number mm "+_circles.children.indexOf(this)+ "x: " +(this.orgX +data.global.x -this.curX)+"y: "+(this.orgY +data.global.y -this.curY)+" this.x:"+this.x+" this.y:"+this.y);
       this.data = data;
            // console.log("circle number : "+_circles.children.indexOf(this))
        }
    }
     var mu = function()
     {
     
            this.dragging = null;
            // set the interaction data to null
            this.data = null;
           worker.dragNode({nodeNum:_circles.children.indexOf(this),x:this.position.x,y:this.position.y });
           worker.forceResume(); 
           
         //worker.fixNode({idx:_circles.children.indexOf(this),state:true}); 
            
     //console.log("circle number mu "+_circles.children.indexOf(this)+ "x: " +this.x+"y: "+ this.y);
     }
     var m_over = function()
     {
         worker.fixNode({idx:_circles.children.indexOf(this),state:true}); 
     }
     var m_out = function()
     {
         worker.fixNode({idx:_circles.children.indexOf(this),state:false}); 
     }
        graph.nodes.forEach(function(d, i) {
            d.index = i;
            var graphics = new PIXI.Graphics();
            
            graphics.beginFill("0x9674cf");
            graphics.drawCircle(0, 0, 10);
            var sp = new PIXI.Sprite(graphics.generateTexture());
            sp.interactive = true;
            sp.mousedown = sp.touchstart=md;
           sp.mouseup = sp.mouseupoutside = sp.touchend = sp.touchendoutside =mu;
            sp.mousemove = sp.touchmove = mm; 
            //sp.data = d;
            sp.mouseover = m_over;
            sp.mouseout = m_out;
            
             _circles.addChild(sp);
          //  _circles.addChild(graphics);
        });
        _renderer.render(_stage);
             var graphics = new PIXI.Graphics();
            graphics.beginFill("0x000000");
            graphics.drawCircle(10, 10, 10);
            var tc = new PIXI.Sprite(graphics.generateTexture());
            tc.interactive = true;
           
             _circles.addChild(tc);
    }

    function changeNodeLabel() {
        _node.selectAll("text")
                .text(function(d) {
                    return _nodeLabelAccessor(d.data);
                });
    }

    _fgraph.filterFunction = function(_)
    {
        _filterFunction = _;
        drawData();
    }
    _fgraph.init = function(parent, data, width, height) {
        _width = width;
        _height = height;
        _parentID = parent;
        _fgraph.graphView(data)
                .resize(width, height);

        worker = cw({
            d3init: function(data) {
                self.force = d3.layout.force()
                        .charge(-120)
                        .theta(.8)
                        .linkDistance(30)
                        .size([800, 800]);
                self._nodeData = data.nodes.map(function(d, i) {
                    d.index = i;
                    return {
                        weight: 2
                    };
                });
                self._edgeData = data.edges.map(function(d, i) {
                    d.index = i;
                    return {
                        source: _nodeData[d.source.index],
                        target: _nodeData[d.target.index],
                    };
                });
                self.force
                        .nodes(self._nodeData)
                        .links(self._edgeData)
                        .start();
                self.force.on("tick", _db.tick);
            },
            tick: function()
            {
                var size = self._nodeData.length;
                var x = new Uint16Array(size);
                var y = new Uint16Array(size);
                for (i = 0; i < size; i++)
                {
                    x[i] = _nodeData[i].x;
                    y[i] = _nodeData[i].y;

                }
                var sentData = {x: x, y: y};
                _db.fire("tick", sentData, [sentData.x.buffer, sentData.y.buffer]);
            },
            init: function()
            {
                console.log("Worker started: " + _db.__codeWord__);
                importScripts("js/libs/test/d3F.js");
            },
            dragNode:function(data){
//             self._nodeData[data.nodeNum].x = data.x;
//             self._nodeData[data.nodeNum].y = data.y;
                self._nodeData[data.nodeNum].px = data.x;
                self._nodeData[data.nodeNum].py = data.y;
               // self.force.tick();
               // _db.tick();
            },
            fixNode:function(data)
            {
               self._nodeData[data.idx].fixed = data.state;  
                
          
            },
            forceResume:function()
            {
                self.force.resume();
            },
            forceStop:function()
            {
                self.force.stop();
            },
            
        });
        worker.d3init(data).then(function(a) {

            console.log(a);
        }, function(a) {
            console.log(a);
        });
        var assignLocations = function(ar1, ar2, ar3)
        {
          
                var size = ar1.x.length;
                var children = _circles.children;
                for (i = 0; i < size; i++)
                {
                    children[i].x = ar1.x[i] ;
                    children[i].y = ar1.y[i] ;
                    
                }
                delete ar1;
                 _renderer.render(_stage);
        }
        worker.on("tick", assignLocations);
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
//        if (!arguments.length)
//            return _linkDistance;
//        _linkDistance = _;
//        _force.linkDistance(_linkDistance).start();
        return _fgraph;
    }

    // Change/get strength parameter of force
    _fgraph.strength = function(_) {
//        if (!arguments.length)
//            return _linkStrength;
//        _linkStrength = _;
//        _force.linkStrength(_linkStrength).start();
//        return _fgraph;
    }

    // Change/get charge for graph
    _fgraph.charge = function(_) {
//        if (!arguments.length)
//            return _fCharge;
//        _fCharge = _;
//        _force.charge(_fCharge).start();
//        return _fgraph;
    }


    _fgraph.edgeColors = function(_) {
        if (!arguments.length)
            return _edgeColors;
        _edgeColors = _;

        _fgraph.updateEgdeStyle("stroke", _);
        return _fgraph;
    }



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

    _fgraph.nodeColorAccessor = function(_) {
        if (!arguments.length)
            return _nodeColorAccessor;
        _nodeColorAccessor = _;
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

    _fgraph.dblclickHandler = function(_) {
        _dblclickHandler = (typeof _ === 'function') ? _ :
                function(d) {
                };
        return _fgraph;
    }
    return _fgraph;
};
//        var mousedown1  = function(data)
//		{
//                    console.log("Hey there");
//			data.originalEvent.preventDefault();
//			this.evdata = data;
//			this.alpha = 0.9;
//			this.dragging = true;
//};
//            var graphics = new PIXI.Graphics();
//            graphics.lineStyle(2, 0x000000, 1);
//            graphics.beginFill("0xFF11FF");
//            graphics.drawCircle(100,100, 10);
//            var bunny = new PIXI.Sprite(graphics.generateTexture ());
//            bunny.interactive = true;
//            bunny.mousedown=bunny.touchstart=function(data)
//		{
//                    console.log("Hey there");
//		};
//            _stage.addChild(bunny);
//		// set the events for when the mouse is released or a touch is released
//		var mouseout= function(data)
//		{
//			this.alpha = 1
//			this.dragging = false;
//			// set the interaction data to null
//			this.evdata = null;
//		};
//
//		// set the callbacks for when the mouse or a touch moves
//		var mousemove = function(data)
//		{
//			if(this.dragging)
//			{
//				var newPosition = this.evdata.getLocalPosition(this.parent);
//				this.position.x = newPosition.x;
//				this.position.y = newPosition.y;
//			}
//		}