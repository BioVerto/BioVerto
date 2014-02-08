angular.module("MyApp")
        .service('configurationService', function() {

            var forceLayoutControlsObj = [
                {controltype: "colorpicker", datatype: "color",     name: "P1", tab: "Edge", label: "Edge Color Range",func: "edgeColors",      ignore:false},
                {controltype: "select",      datatype: "number",    name: "P2", tab: "Edge", label: "Edge Color ",     func: "edgeColorAcessor",ignore:false},
                {controltype: "select",      datatype: "character", name: "P3", tab: "Edge", label: "Edge Text ",      func: "edgeTextAcessor", ignore:false},
                {controltype: "colorpicker", datatype: "color",     name: "P4", tab: "Node", label: "Node Color Range",func: "nodeColors",      ignore:false},
                {controltype: "select",      datatype: "character", name: "P5", tab: "Node", label: "Node Label",      func: "nodeLabelAcessor",ignore:false},
                {controltype: "select",      datatype: "number",    name: "P6", tab: "Node", label: "Node Size",       func: "nodeSizeAcessor", ignore:false},
                {controltype: "range",       datatype: "number",    name: "P7", tab:"Global",label: "Charge",          func: "forceCharge",     ignore:false,options:{min:-50,max:50,default:30,step:5}},
                {controltype: "range",       datatype: "number",    name: "P8", tab:"Global",label: "Gravity",         func: "forceGravity",    ignore:false,options:{min:0,max:1,default:.1,step:.1}},
                {controltype: "range",       datatype: "number",    name: "P9", tab:"Global",label: "Friction",        func: "forceFriction",   ignore:false,options:{min:0,max:1,default:.9,step:.1}},
                {controltype: "range",       datatype: "number",    name: "P10", tab:"Global",label: "Theta",          func: "forceTheta",    ignore:false,options:{min:0,max:1,default:.8,step:.1}},

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