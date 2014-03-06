
describe("Closeness Centrality", function() {
	
	it("contains spec with an expectation", function() {
		var testg1 = g5.createGraph("testg1");
		testg1.addEdge("a", "b", null, false);
		testg1.addEdge("a", "c", null, false);
		testg1.addEdge("b", "c", null, false);
		testg1.addEdge("c", "d", null, false);
		testg1.addEdge("d", "e", null, false);
		testg1.addEdge("e", "f", null, false);
		testg1.addEdge("e", "g", null, false);
		testg1.addEdge("e", "h", null, false);
		testg1.addEdge("f", "h", null, false);
		testg1.addEdge("g", "h", null, false);
        testg1.addEdge("i", "k", null, false);
        testg1.addEdge("j", "k", null, false);
        testg1.addEdge("k", "l", null, false);
        testg1.addEdge("j", "l", null, false);
		g5.applyAlgorithm(testg1,"Connected Components");
		var calculated = [];
		var alg = g5.algoPlugins["Closeness Centrality"];
		alg.algo(testg1);
		var accFn = null;
		for (var nA in alg.nodeAccs) {			// Why for loop ?
            accFn = alg.nodeAccs[nA].fct;
            break;
		}
		for (var i in testg1.nodes)
            calculated.push(accFn(testg1.nodes[i]));
        var ans = [0.0233, 0.0233, 0.0317, 0.037, 0.037, 0.0261, 0.0261, 0.0277, 0.0222, 0.037, 0.0277, 0.0277];
		expect(calculated).toEqual(ans);
	});

        it("contains spec with an expectation", function() {
            var testg2 = g5.createGraph("testg2");
            testg2.addEdge("a", "c", null, false);
            testg2.addEdge("b", "c", null, false);
            testg2.addEdge("c", "d", null, false);
            testg2.addEdge("c", "e", null, false);
            testg2.addEdge("c", "f", null, false);
            testg2.addEdge("g", "h", null, false);
            testg2.addEdge("h", "i", null, false);
            testg2.addEdge("i", "j", null, false);
            testg2.addEdge("j", "k", null, false);
            testg2.addEdge("k", "l", null, false);
            testg2.addEdge("l", "g", null, false);
            g5.applyAlgorithm(testg2,"Connected Components");
            var calculated = [];
            var alg = g5.algoPlugins["Closeness Centrality"];
            alg.algo(testg2);
            var accFn = null;
            for (var nA in alg.nodeAccs) {
                accFn = alg.nodeAccs[nA].fct;
                break;
            }
            for (var i in testg2.nodes)
                calculated.push(accFn(testg2.nodes[i]));
            var ans = [0.0277, 0.05, 0.0277, 0.0277, 0.0277, 0.0277, 0.0277, 0.0277, 0.0277, 0.0277, 0.0277, 0.0277];
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
