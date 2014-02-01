angular.module("MyApp")
    .service('configurationService', function(){

                    var forceLayoutControlsObj = [
                {controltype: "colorpicker",datatype:"color", name: "P1", tab: "Edge", label: "Edge color", func: "edgeColors"},
                 {controltype: "colorpicker",datatype:"color", name: "P2", tab: "Node", label: "Node color", func: "nodeColors"}                                ];
                    this.getConfig = function(layout)
                    {
                        switch (layout)
                        {
                            case "force":
                                return forceLayoutControlsObj;
                        }
                    }

    })