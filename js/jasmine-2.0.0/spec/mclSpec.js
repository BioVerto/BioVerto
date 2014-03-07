
describe("MCL clustering ", function() {
	
	it("contains spec with an expectation", function() {
		var testg1 = g5.createGraph("testg1");
		testg1.addEdge("a", "b", null, false);
		testg1.addEdge("a", "d", null, false);
		testg1.addEdge("a", "f", null, false);
		testg1.addEdge("c", "b", null, false);
		testg1.addEdge("d", "e", null, false);
		testg1.addEdge("e", "f", null, false);
		
		g5.applyAlgorithm(testg1,"Connected Components");
		var calculated = [];
		var alg = g5.algoPlugins["MCL clustering Algorithm"];
                alg.algo(testg1);
                var accFn = null;
		for (var nA in alg.nodeAccs) {
            accFn = alg.nodeAccs[nA].fct;
            break;
		}
		for (var i in testg1.nodes)
            calculated.push(accFn(testg1.nodes[i]));
        var ans = [1, 2, 3, 3, 4, 2];
		expect(calculated).toEqual(ans);
	});

      
});
