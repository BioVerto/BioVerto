



window.graph = function(context){
	var graph = this;
	var nodes = {};
	var edges = [];
	
	var graph_Methods = {
	
	
	addNode : function(id, content) {
        /* testing if node is already existing in the graph */
        if(this.nodes[id] == undefined) {
            this.nodes[id] = new Graph.Node(id, content);
        } else {
	    jQuery.extend(this.nodes[id].data, content);//data->content
		}
        return this.nodes[id];
    },

    // TODO: allow update of data for an edge
	//Discuss with Prof. DOBRA
    addEdge : function(source, target, data, directed) {
        
		console.log(this);
		var s = this.addNode(source,data);
        var t = this.addNode(target,data);
        var e = this.Edge.build(s,t);
		jQuery.extend(edge.data, data);
        if (directed) { // if directed edge, add it to target adjList
			t.edges.push(edge);
			edge.directed = true;
		}
        s.edges.push(edge);
        this.edges.push(edge);
    },
    
    removeNode : function(id) {
        delete this.nodes[id];
        for(var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].source.id == id || this.edges[i].target.id == id) {
                this.edges.splice(i, 1);
                i--;
            }
        }
    }
	
	};


}


var Node = function(){
	//console.log(this);
	this.name = "";
	this.id = -1;

};


var Edge = function(){
	
	console.log(this);
	this.data = new Object();
	this.weight = -1;
	this.directed = false;
	
	build : function(s,d){
		var e = jQuery.extend(this,s,d);
		return e;
	}

};