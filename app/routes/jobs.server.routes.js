'use strict';

var jobScheduler = require('../../app/controllers/jobScheduler');

module.exports = function(app) {
    // Article Routes
    app.route('/createJobs')
       .get(jobScheduler.createJob);
}