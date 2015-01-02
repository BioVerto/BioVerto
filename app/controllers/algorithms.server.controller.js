'use strict';

/**
 * Module dependencies.
 */



var fs = require("fs");
exports.listAlgos = function(req, res) {
    var dir = "./algorithms/metadata/";
    var data = {};
    fs.readdir(dir,function(err,files) {
        console.log(files);
        if (err) throw err;
        var c = 0;
        files.forEach(function (file) {
            c++;
            fs.readFile(dir + file, 'utf-8', function (err, contents) {
                if (err) throw err;
                data[file] = JSON.parse(contents);
                if (0 === --c) {
                    res.jsonp(data);  //socket.emit('init', {data: data});
                }
            });
        });
    });
}
