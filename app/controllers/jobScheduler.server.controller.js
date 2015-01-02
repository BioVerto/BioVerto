'use strict';

/**
 * Modules dependencies.
 */
var kue = require('kue');
    var jobs = kue.createQueue();
kue.app.listen(4567);
function newJob (name){
    name = name || 'Default_Name';
    var job = jobs.create('new job', {
        name: name
    });
    job
        .on('complete', function (){
            console.log('Job', job.id, 'with name', job.data.name, 'is    done');
        })
        .on('failed', function (){
            console.log('Job', job.id, 'with name', job.data.name, 'has  failed');
        });
    job.save();
}
jobs.process('new job', function (job, done){
   console.log("Doing job");
    done && done();
});

exports.createJob = function(req, res) {
    setInterval(function (){
        newJob('Send_Email');
    }, 3000);
};
