angular.module("MyApp")
        .service('graphIOPluginProvider', function(graphProvider, d3) {
            var csvPlugin = function(g5, blob) {
                return d3.csv.parse(blob);
            }
            var mintTsvPlugin = function(g5, blob) {
              var tsv =  d3.dsv("\t", "text/plain");;
              var a = tsv.parse(blob);
                return tsv.parse(blob);
            };
            this.getPlugin = function(plugin) {
                switch (plugin)
                {
                    case "csv":
                        return csvPlugin;
                    break;
                    case "mint":
                        return mintTsvPlugin;
                }
            }
            this.listPlugin = function()
            {
                return  ["csv", "tsv"];
            }

        });