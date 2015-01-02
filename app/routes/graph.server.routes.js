'use strict';

var graph = require('../../app/controllers/graph');

module.exports = function(app) {
    // Article Routes
    app.route('/graphMakeMINTdb')
       .get(graph.makeMintdb);
    app.route('/graphMakeBiogriddb')
        .get(graph.makeBiogriddb);
    app.route("/listGraphs")
        .get(graph.listGraph);
    app.route("/getDb")
        .get(graph.getDb);
    app.route("/deleteDbs")
        .get(graph.deleteDbs);

}