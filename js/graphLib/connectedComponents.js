(function(g5) {
    var f = g5.newField();
    g5.addAlgoPlugin({
        name: "Connected Components",
        algo: function(g) {
            var j = 0;
            for (i in g.nodes) {
                g.nodes[i].data[f] = j++;
            }

            var VERTEX_COUNT = Object.keys(g.nodes).length;
            var components = new UnionFind(VERTEX_COUNT);
            for (var i = 0; i < g.edges.length; i++) {
                components.link(g.edges[i].source.data[f], g.edges[i].target.data[f]);
            }

            g.connectedComponents = {};
            for (i in g.nodes) {
                var groupId = components.find(g.nodes[i].data[f]);
                g.connectedComponents[groupId] = g.connectedComponents[groupId] || [];
                g.connectedComponents[groupId].push(g.nodes[i]);
                g.nodes[i].data[f] = groupId;
            }
        },
        nodeAccs: {
            "Connected Components": {type: "number", fct: g5.createAccessor(f)}
        },
        visible: false});

}(g5)); 