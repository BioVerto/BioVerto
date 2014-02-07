angular.module("MyApp")
        .service('viewProvider', function(d3) {
            this.getView = function(type)
            {
                switch (type)
                {
                    case "force":
                        return dc.fgraph();
                }
            }
          
        });