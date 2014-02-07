angular.module("MyApp")
        .service('graphAlgoPluginProvider', function() {
            var csvPlugin = function(g5, blob) {
                return d3.csv.parse(blob);
            }
            this.getPlugin = function(plugin) {
                switch (plugin)
                {
                    case "csv":
                        return csvPlugin;
                }
            }
            this.listPlugin = function()
            {
                return  ["csv"];
            }

        });