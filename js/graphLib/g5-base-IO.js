// import "g5.js"
// import "d3.js"

/* This file contains base IO pluggins */
// Comma separated edge graph with implicit nodes
(function(g5){
    g5.addIOPlugin( "csv",
    function(blob) {
        return d3.csv.parse(blob);
    });
}(g5));

(function(g5){
    g5.addIOPlugin( "mint",
    function(blob) {
        var tsv =  d3.dsv("\t", "text/plain");
        return tsv.parse(blob);
    })
}(g5));  