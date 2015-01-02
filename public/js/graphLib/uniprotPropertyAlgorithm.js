(function(g5) {
    var f1 = " ";
    var f2 = " ";
    var f3 = " ";
    g5.addAlgoPlugin({
        name: "Uniprot Data",
        algo: function(g) {
                  f1 = g.newField();
                  f2 = g.newField();
                  f3 = g.newField();
           
                d3.text(BioVertoPath+"/MINT-full/uniprot.list", function(result) {
                var rows = d3.csv.parseRows(result);
                for (i = 0; i < rows.length; i++) {
                    if (g.nodes[rows[i][0]] !== undefined)
                    {   
                        g.nodes[rows[i][0]].data[f1] = rows[i][1];
                        g.nodes[rows[i][0]].data[f2] = parseInt(rows[i][2]);
                        g.nodes[rows[i][0]].data[f3] = parseInt(rows[i][3]);
                    }   
                }
                for (var i in g.nodes) {
                    g.nodes[i].data[f1] = g.nodes[i].data[f1] || "";
                    g.nodes[i].data[f2] = g.nodes[i].data[f2] || 1;  
                    g.nodes[i].data[f3] = g.nodes[i].data[f3] || 1;
                }
            }
            );
        },
        nodeAccs:function(){return  {
            "Name": {type: "character", fct: g5.createAccessor(f1)},
            "Sequence Length": {type: "number", fct: g5.createAccessor(f2)},
            "GO Terms": {type: "number", fct: g5.createAccessor(f3)}
        }},visible:false
    });
}(g5));
