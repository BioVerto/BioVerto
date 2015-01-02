// import "g5.js"
// import "d3.js"

/* This file contains base IO pluggins */
// Comma separated edge graph with implicit nodes
(function(g5) {
    g5.addIOPlugin("csv",
            function(blob) {
                return d3.csv.parse(blob);
            });
}(g5));

(function(g5) {
    g5.addIOPlugin("mint",
            function(blob) {
                var tsv = d3.dsv("\t", "text/plain");
                return tsv.parse(blob);
            })
}(g5));
(function(g5) {
    g5.addIOPlugin("microArr",
            function(contents) {
                var lines = contents.split("\n");
                var values = lines[0].split(" ");

                numRows = lines.length - 1;
                numColumns = values.length - 1;
                //readHeadingAndSampleIds(lines);
                var data_matrix = new Float32Array(numRows * numColumns);
                for (i = 0; i < numRows; i++) {
                    var values = lines[i].split(" ");
                    for (j = 0; j < numColumns -1 ; j++) {
                        var x = parseFloat(values[j+1]);
                        if (isNaN(x) || x === undefined) {
                        }
                        data_matrix[j * numRows + i] = x;
                    }
                }
                return  {
                    data: data_matrix,
                    row: numColumns,
                    col: numRows
                   
                };
            }
    )
}(g5))
