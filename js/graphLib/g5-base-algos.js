// import "g5.js"

/* This file contains basic algorithmic pluggins */


//// Out degree computation. Simply counts the numer of out degrees
//(function(g5) {
//    // new field and register accessor for it under algo name
//    var f1 = g5.newField();
//    var f2 = g5.newField();
//
//    g5.addAlgoPlugin({
//        name: "Degree Centrality",
//        algo: function(g) {
//            for (var i in g.nodes) {
//           g.nodes[i].data[f2]=0;
//            }
//            for (var i in g.nodes) {
//                var node = g.nodes[i];
//                node.data[f1] = node.edges.length;
//                for (j in node.edges)
//                {
//                        innode = node.edges[j].target.data[f2]++;
// 
//                }
//            }
//        },
//        nodeAccs: {
//            "Out Degree": {type: "number", fct: g5.createAccessor(f1)},
//            "In Degree": {type: "number", fct: g5.createAccessor(f2)},
//        }});
//}(g5));
(function(g5) {
    // new field and register accessor for it under algo name
    var f = g5.newField();
    g5.addAlgoPlugin({
        name: "Degree Centrality",
        algo: function(g) {
            for (var i in g.nodes) {
                g.nodes[i].data[f] = 0;
            }
            for (var i in g.edges) {
                for (var j = i - 1; j > -1; j--) {
                    if (g.edges[i].source === g.edges[j].target && g.edges[i].target === g.edges[j].source)
                    {
                        break;
                    }
                }
                if(j===-1)
                {
                    g.edges[i].source.data[f]++;
                    g.edges[i].target.data[f] ++;
                }
            }
        },
        nodeAccs: {
            "Degree": {type: "number", fct: g5.createAccessor(f)},
        },visible:false});
}(g5));

// Random data node algo
(function(g5) {
    var randomNumber = function() {
        return Math.floor(Math.random() * (9)) + 1;
    };
    var f = g5.newField();
    g5.addAlgoPlugin({
        name: "Random Data Generator",
        algo: function(g) {
            for (i in g.nodes) {
                var node = g.nodes[i];
                node.data[f] = randomNumber();
            }
        },
        nodeAccs: {
            "Random Data": {type: "number", fct: g5.createAccessor(f)}
        },visible:false
    });
}(g5));
