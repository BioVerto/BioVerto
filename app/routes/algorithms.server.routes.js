'use strict';

var algorithms = require('../../app/controllers/algorithms');

module.exports = function(app) {
    // Article Routes
    app.route('/listAlgos')
       .get(algorithms.listAlgos);
}