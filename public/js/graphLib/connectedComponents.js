(function(g5) {
    var f = " ";
    g5.addAlgoPlugin({
        name: "Connected Components",
        algo: function(g) {
              f = g.newField();
           
            var j = 0;
            for (i in g.nodes) {
                g.nodes[i].data[f] = j++;
            }

            var VERTEX_COUNT = Object.keys(g.nodes).length;
            var components = new UnionFind(VERTEX_COUNT);
            for (var i = 0; i < g.edges.length; i++) {
                components.link(g.edges[i].source.data[f], g.edges[i].target.data[f]);
            }

            g.connectedComponentsNodes = {};
            for (i in g.nodes) {
                var groupId = components.find(g.nodes[i].data[f]);
                g.connectedComponentsNodes[groupId] = g.connectedComponentsNodes[groupId] || [];
                g.connectedComponentsNodes[groupId].push(g.nodes[i]);
                g.nodes[i].data[f] = groupId;
            }
             g.connectedComponentsEdges = {};
             for (i in g.edges) {
                var groupId = g.edges[i].source.data[f];
                g.connectedComponentsEdges[groupId] = g.connectedComponentsEdges[groupId] || [];
                g.connectedComponentsEdges[groupId].push(g.edges[i]);
            }
        },
        nodeAccs: function(){return {
            "Connected Components": {type: "number", fct: g5.createAccessor(f)}
        }},
        visible: false});

}(g5)); 