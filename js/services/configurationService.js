angular.module("MyApp")
        .service('configurationService', function() {

            var forceLayoutControlsObj = [
                {controltype: "colorpicker", datatype: "color",     name: "P1", tab: "Edge", label: "Edge Color Range",func: "edgeColors",      ignore:false},
                {controltype: "select",      datatype: "number",    name: "P2", tab: "Edge", label: "Edge Color ",     func: "edgeColorAcessor",ignore:false},
                {controltype: "select",      datatype: "character", name: "P3", tab: "Edge", label: "Edge Text ",      func: "edgeTextAcessor", ignore:false},
                {controltype: "colorpicker", datatype: "color",     name: "P4", tab: "Node", label: "Node Color Range",func: "nodeColors",      ignore:false},
                {controltype: "select",      datatype: "character", name: "P5", tab: "Node", label: "Node Label",      func: "nodeLabelAcessor",ignore:false},
                {controltype: "select",      datatype: "number",    name: "P6", tab: "Node", label: "Node Size",       func: "nodeSizeAcessor", ignore:false},
                {controltype: "range",       datatype: "number",    name: "P7", tab:"Global",label: "Charge",          func: "charge",     ignore:false,options:{min:-200,max:10,default:-30,step:5}},
                {controltype: "range",       datatype: "number",    name: "P8", tab:"Global",label: "Link Strength",   func: "strength",    ignore:false,options:{min:0,max:1,default:.1,step:.01}},
                {controltype: "range",       datatype: "number",    name: "P10", tab:"Global",label: "Distance",       func: "distance",    ignore:false,options:{min:0,max:100,default:20,step:1}},

            ];
           
            this.getConfig = function(layout)
            {
                switch (layout)
                {
                    case "force":
                        return forceLayoutControlsObj;
                }
            }

        })