
(function(g5) {
    // new field and register accessor for it under algo name
    var f = " ";
    g5.addAlgoPlugin({
        name: "Degree Centrality",
        algo: function(g) {
            var tempData = new Array(g.numNodes);
            for (var i = 0 ;i< tempData.length; i ++) {
                tempData[i] = 0;
            }
            for (var i in g.edges) {
                for (var j = i - 1; j > -1; j--) {
                    if (g.edges[i].Source === g.edges[j].Target && g.edges[i].Target === g.edges[j].Source)
                    {
                        break;
                    }
                }
                if(j===-1)
                {
                    tempData[g.edges[i].Source]++;
                    tempData[g.edges[i].Target]++;
                }
            }
            return {
                nodeAttributes:{
                 "Degree": {data:tempData,datatype: "integer",visible:false,name:"Degree"}
                }
            };
        }
        }
     )
}(g5));

// Random data node algo
(function(g5) {
    var randomNumber = function() {
        return Math.floor(Math.random() * (9)) + 1;
    };
    var f =" ";
    g5.addAlgoPlugin({
        name: "Random Data Generator",
        algo: function(g) {
              f = g.newField();
           
            for (i in g.nodes) {
                var node = g.nodes[i];
                node.data[f] = randomNumber();
            }
        },
        nodeAccs:function(){return  {
            "Random Data": {type: "number", fct: g5.createAccessor(f)}
        }},visible:false
    });
}(g5));
