angular.module("MyApp")
        .service('fileLoaderService', function(d3) {
            this.loadFile = function(file, callback)
            {
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    return callback;
                })(file);
                reader.readAsText(file);
            }
        });