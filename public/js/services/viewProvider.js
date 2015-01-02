angular.module("MyApp")
        .service('viewProvider', function(d3) {
            this.getView = function(type)
            {
                switch (type)
                {
                    case "force":
                        return dc.fgraph();
                        break;
                    case "circular":
                        return dc.cgraph();
                        break;
                    case "chord":
                        return dc.chord();
                        break;
                    
                }
            }
          
        });