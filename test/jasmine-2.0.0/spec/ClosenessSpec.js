
describe("Closeness Centrality", function() {
	
	it("contains spec with an expectation", function() {
		var testg4 = g5.createGraph("testg4");
		testg4.addEdge("a", "b", null, false);
		testg4.addEdge("a", "c", null, false);
		testg4.addEdge("b", "c", null, false);
		testg4.addEdge("c", "d", null, false);
		testg4.addEdge("d", "e", null, false);
		testg4.addEdge("e", "f", null, false);
		testg4.addEdge("e", "g", null, false);
		testg4.addEdge("e", "h", null, false);
		testg4.addEdge("f", "h", null, false);
		testg4.addEdge("g", "h", null, false);
        testg4.addEdge("i", "k", null, false);
        testg4.addEdge("j", "k", null, false);
        testg4.addEdge("k", "l", null, false);
        testg4.addEdge("j", "l", null, false);
		g5.applyAlgorithm(testg4,"Connected Components");
		var calculated = [];
		var alg = g5.algoPlugins["Closeness Centrality"];
		alg.algo(testg4);
		var accFn = null;
		for (var nA in alg.nodeAccs) {			// Why for loop ?
            accFn = alg.nodeAccs[nA].fct;
            break;
		}
		for (var i in testg4.nodes)
            calculated.push(accFn(testg4.nodes[i]));
        var ans = [ 0.0526, 0.0526, 0.0714, 0.0833, 0.0833, 0.0588, 0.0588, 0.0625, 0.2, 0.3333, 0.25, 0.25];
		expect(calculated).toEqual(ans);
	});

        it("contains spec with an expectation", function() {
            var testg3 = g5.createGraph("testg3");
            testg3.addEdge("a", "c", null, false);
            testg3.addEdge("b", "c", null, false);
            testg3.addEdge("c", "d", null, false);
            testg3.addEdge("c", "e", null, false);
            testg3.addEdge("c", "f", null, false);
            testg3.addEdge("g", "h", null, false);
            testg3.addEdge("h", "i", null, false);
            testg3.addEdge("i", "j", null, false);
            testg3.addEdge("j", "k", null, false);
            testg3.addEdge("k", "l", null, false);
            testg3.addEdge("l", "g", null, false);
            g5.applyAlgorithm(testg3,"Connected Components");
            var calculated = [];
            var alg = g5.algoPlugins["Closeness Centrality"];
            alg.algo(testg3);
            var accFn = null;
            for (var nA in alg.nodeAccs) {
                accFn = alg.nodeAccs[nA].fct;
                break;
            }
            for (var i in testg3.nodes)
                calculated.push(accFn(testg3.nodes[i]));
            var ans = [0.1111, 0.2, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111];
            expect(calculated).toEqual(ans);
	});
        
//        it("contains spec with an expectation", function() {
//            var testg3 = g5.createGraph("testg3");
//            testg3.addEdge("a", "b", null, false);
//            testg3.addEdge("c", "d", null, false);
//            
//            g5.applyAlgorithm(testg3,"Connected Components");
//            var calculated = [];
//            var alg = g5.algoPlugins["Betweenness Centrality"];
//            alg.algo(testg3);
//            var accFn = null;
//            for (var nA in alg.nodeAccs) {
//                accFn = alg.nodeAccs[nA].fct;
//                break;
//            }
//            for (var i in testg3.nodes)
//                calculated.push(accFn(testg3.nodes[i]));
//            var ans = [0, 0, 0, 0];
//            expect(calculated).toEqual(ans);
//	}); 
        
});
