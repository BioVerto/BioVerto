angular.module("MyApp")
    .service('configurationService', function() {

        var forceLayoutControlsObj = [
           
            {controltype: "select",      datatype: "character", tab: "Node", label: "Node Label",      func: "nodeLabelAcessor",ignore:false},
            {controltype: "select",      datatype: "number",    tab: "Node", label: "Node Size",       func: "nodeSizeAcessor", ignore:false},
            {controltype: "range",       datatype: "number",     tab:"Node",label: "Min node size",    func: "minNodeSize",    ignore:false,options:{min:5,max:50,default:10,step:1}},
            {controltype: "range",       datatype: "number",     tab:"Node",label: "Max node size",    func: "maxNodeSize",    ignore:false,options:{min:10,max:50,default:15,step:1}},
	    {controltype: "select",      datatype: "number",     tab: "Node", label: "Color Attribute",      func: "nodeColorAcessor", ignore:false},
            {controltype: "colorpicker", datatype: "color",     tab: "Node", label: "Cold Color",func: "minNodeColor",      ignore:false,options:{default:"blue"}},
            {controltype: "colorpicker", datatype: "color",      tab: "Node", label: "Hot Color",func: "maxNodeColor",      ignore:false,options:{default:"red"}},            

            {controltype: "colorpicker", datatype: "color",     tab: "Edge", label: "Edge Color Range",func: "edgeColors",      ignore:false,options:{default:"blue"}},
            {controltype: "select",      datatype: "number",    tab: "Edge", label: "Edge Color ",     func: "edgeColorAccessor",ignore:false},
            {controltype: "select",      datatype: "character", tab: "Edge", label: "Edge Text ",      func: "edgeTextAcessor", ignore:false},

          
            {controltype: "range",       datatype: "number",    tab:"Global",label: "Charge",          func: "charge",     ignore:false,options:{min:-200,max:10,default:-30,step:5}},
            {controltype: "range",       datatype: "number",    tab:"Global",label: "Link Strength",   func: "strength",    ignore:false,options:{min:0,max:1,default:.1,step:.01}},
            {controltype: "range",       datatype: "number",     tab:"Global",label: "Distance",       func: "distance",    ignore:false,options:{min:0,max:100,default:20,step:1}},
	    
        ];

        var circularLayoutControlsObj = [
	    {controltype: "range",       datatype: "number",   tab:"Global",label: "Text radius",  func: "textRadius",     ignore:false,options:{min:10,max:100,default:30,step:1}},
            
	];

        this.getConfig = function(layout)
        {
            switch (layout)
            {
            case "force":
                return forceLayoutControlsObj;
                break;
            case "circular":
                return circularLayoutControlsObj;
                break;
            case "chord":
                return [];
                break;    
            }
        }

    })
