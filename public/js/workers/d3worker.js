

var D3Worker = function(initData) {

// The Object inside the cw call below is copied into the worker. A understanding of catiline recommended
    var worker = cw({
        //init is automatically called by catiline
        init: function()
        {
            console.log("Worker started: " + _db.__codeWord__);
            importScripts("js/libs/D3WithoutDom/d3.js");
        },
        //Initialise Force Layout in Worker
        initd3:function(initData){
            self.force = d3.layout.force()
                .charge(-120)
                .theta(.8)
                .linkDistance(30)
                .size([800, 800]);
         //Build the node and edge datastructure in worker
            self._nodeData = initData.nodes.map(function(d, i) {
                d.index = i;
                return {
                    index:i,
                    weight: 2
                };
            });

            self._edgeData = initData.edges.map(function(d, i) {

                return {
                    index:i,
                    source: _nodeData[d.Source],
                    target: _nodeData[d.Target]
                };
            });
            //Start Force layout
            self.force
                .nodes(self._nodeData)
                .links(self._edgeData)
                .start();
        },
        //Handle on events
        onHandler:function(name){
            self.force.on(name,this[name]);

        },
        //call methods on force layout
        callForce:function(i,args){
            self.force[i.name].apply(this, i.args);
        },
        //tickHandler
        tick: function()
        {
            var _nodeData = self.force.nodes();
            var size = _nodeData.length;
            var x = new Int16Array(size);
            var y = new Int16Array(size);
            for (var i = 0; i < size; i++)
            {
                x[i] = _nodeData[i].x;
                y[i] = _nodeData[i].y;

            }
            var sentData = {x: x, y: y};
            self._db.fire("tick", sentData, [sentData.x.buffer, sentData.y.buffer]);
        },
        //Pin the node
        fixNode:function(data)
        {
            self._nodeData[data.idx].fixed = data.state;
        },
        //Resume force layout
        forceResume:function()
        {
            self.force.resume();
        },
        //Stop force layout
        forceStop:function()
        {
            self.force.stop();
        },
        //Update dragged node location
        updateLocation:function (data){
            self._nodeData[data.i].x = data.x;
            self._nodeData[data.i].y = data.y;

        }

    });
    this.worker = worker;
    worker.initd3(initData);

    // The code below hooks the d3 force layout methods to methods in the force layout in worker
    var _force = new d3.layout.force();
    for(i in _force) {
        if (typeof _force[i] == "function") {
            if (i !== "on" || i!== "nodes"|| i!== "links" ) {
                _force[i] = (function (i, worker) {
                    return function () {
                        var args = [];
                        for(j in arguments){
                            args.push(arguments[j])
                        }

                        worker.callForce({name: i, args: args}).then(function(a) {

                            console.log(a);
                        }, function(a) {
                            console.log(a);
                        });
                        return _force;
                    }
                }(i, worker))
            }
            //register Events and corresponding handler
            if (i == "on") {
                _force[i] = function (attr, func) {
                    worker.on(attr, func);
                    worker.onHandler(attr).then(function(a) {

                        console.log(a);
                    }, function(a) {
                        console.log(a);
                    });
                };
            }
            //Its difficult to set or retrieve the nodes and links after init.
            if (i == "links"|| i== "nodes") {
                _force[i] = function() {
                    throw "Links and nodes cannot be set inside Worker after init";
                }
            }
        }
    }

   // Special function to send info about dragged node to the worker
        _force.updateLocation = function(i,x,y){
                worker.updateLocation({i:i,x:x,y:y});
        };
return _force;
};

