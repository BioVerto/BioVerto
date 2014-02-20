describe("Closeness Centrality", function() {
  
	// 3 sample test cases
	var Node = function() {};

	Node.prototype.create = function(id1) {
		var n = new Object();
		var data1 = {};
		data1.id = id1;
		data1.distance = -1;
		n.data = data1;
		return n;
	};

	var Edge = function() {};

	Edge.prototype.create = function(s,t,w) {
		var e = new Object();
		e.source = s;
		e.target = t;
		e.weight = w;
		e.directed = false;
		return e;
	};
	
  
  it("contains spec with an expectation", function() {
		
	

	var g1 = {};

	g1.nodes = [];

	g1.edges = [];

	var n = new Node();
	g1.nodes[0] = n.create(0);
	g1.nodes[1] = n.create(1);
	g1.nodes[2] = n.create(2);
	g1.nodes[3] = n.create(3);

	var e = new Edge();
	g1.edges[0] = e.create(g1.nodes[0],g1.nodes[2],1);
	g1.edges[1] = e.create(g1.nodes[1],g1.nodes[2],1);
	g1.edges[2] = e.create(g1.nodes[2],g1.nodes[3],1);
	g1.edges[3] = e.create(g1.nodes[1],g1.nodes[3],1);

	console.log(g1);

	var calculated = calculate_Closeness(g1);
	
	var ans = [0.2, 0.25, 0.3333333333333333, 0.25];
	
	expect(calculated).toEqual(ans);
  });
  
  
  
  it("contains spec with an expectation", function() {
		
	

	var g2 = {};

	g2.nodes = [];

	g2.edges = [];

	var n = new Node();
	g2.nodes[0] = n.create(0);
	g2.nodes[1] = n.create(1);
	g2.nodes[2] = n.create(2);
	g2.nodes[3] = n.create(3);
	g2.nodes[4] = n.create(4);
	g2.nodes[5] = n.create(5);
	
	var e = new Edge();
	g2.edges[0] = e.create(g2.nodes[0],g2.nodes[2],1);
	g2.edges[1] = e.create(g2.nodes[1],g2.nodes[2],1);
	g2.edges[2] = e.create(g2.nodes[2],g2.nodes[3],1);
	g2.edges[3] = e.create(g2.nodes[2],g2.nodes[4],1);
	g2.edges[4] = e.create(g2.nodes[2],g2.nodes[5],1);
	
	console.log(g2);

	var calculated = calculate_Closeness(g2);
	
	var ans = [ 0.1111111111111111, 0.1111111111111111, 0.2, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111 ];
	
	expect(calculated).toEqual(ans);
  });

it("contains spec with an expectation", function() {
		
	

	var g2 = {};

	g2.nodes = [];

	g2.edges = [];

	var n = new Node();
	g2.nodes[0] = n.create(0);
	g2.nodes[1] = n.create(1);
	g2.nodes[2] = n.create(2);
	g2.nodes[3] = n.create(3);
	g2.nodes[4] = n.create(4);
	g2.nodes[5] = n.create(5);
	
	var e = new Edge();
	g2.edges[0] = e.create(g2.nodes[0],g2.nodes[1],1);
	g2.edges[1] = e.create(g2.nodes[1],g2.nodes[2],1);
	g2.edges[2] = e.create(g2.nodes[2],g2.nodes[3],1);
	g2.edges[3] = e.create(g2.nodes[3],g2.nodes[4],1);
	g2.edges[4] = e.create(g2.nodes[4],g2.nodes[5],1);
	g2.edges[5] = e.create(g2.nodes[5],g2.nodes[0],1);
	
	
	console.log(g2);

	var calculated = calculate_Closeness(g2);
	
	var ans = [ 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111, 0.1111111111111111 ];
	
	expect(calculated).toEqual(ans);
  });
  
});