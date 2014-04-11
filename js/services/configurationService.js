angular.module("MyApp")
    .service('configurationService', function() {

        var forceLayoutControlsObj = [
           
            {controltype: "select",      datatype: "character",default: "None",   tab: "Node", label: "Node Label",      func: "nodeLabelAcessor",ignore:false},
            {controltype: "select",      datatype: "number",   default:"None" ,   tab: "Node", label: "Node Size",       func: "nodeSizeAcessor", ignore:false},
            {controltype: "range",       datatype: "number",   default:10 ,   tab:"Node",label: "Min node size",    func: "minNodeSize",    ignore:false,options:{min:5,max:40,step:1}},
            {controltype: "range",       datatype: "number",   default:15 ,   tab:"Node",label: "Max node size",    func: "maxNodeSize",    ignore:false,options:{min:10,max:40,step:1}},
	    {controltype: "select",      datatype: "number",   default:"None" ,   tab: "Node", label: "Color Attribute",func: "nodeColorAcessor", ignore:false},
            {controltype: "colorpicker", datatype: "color",    default:"#9674cf" ,tab: "Node", label: "Cold Color",      func: "minNodeColor",      ignore:false},
            {controltype: "colorpicker", datatype: "color",    default: "#CC0033", tab: "Node", label: "Hot Color",      func: "maxNodeColor",      ignore:false},            
            
            {controltype: "select",      datatype: "number",   default:"None" ,   tab: "Edge", label: "Edge Size",       func: "edgeWidthAcessor", ignore:false},
            {controltype: "range",       datatype: "number",   default:2,     tab:"Edge",label: "Min Edge size",    func: "minEdgeWidth",    ignore:false,options:{min:2,max:10,step:1}},
            {controltype: "range",       datatype: "number",   default:5 ,    tab:"Edge",label: "Max Edge size",    func: "maxEdgeWidth",    ignore:false,options:{min:2,max:10,step:1}},
            {controltype: "select",      datatype: "number",   default: "None",   tab: "Edge", label: "Edge Color ",     func: "edgeColorAccessor",ignore:false},
            {controltype: "colorpicker", datatype: "color",    default:"#9674cf"  ,tab: "Edge", label: "Cold Color",      func: "minEdgeColor",      ignore:false},
            {controltype: "colorpicker", datatype: "color",    default:"#CC0033" , tab: "Edge", label: "Hot Color",      func: "maxEdgeColor",      ignore:false},            
            {controltype: "select",      datatype: "character",default:"None" ,      tab: "Edge", label: "Edge Label ",      func: "edgeLabelAcessor", ignore:true},

            {controltype: "range",       datatype: "number",   default:-120 ,tab:"Global",label: "Charge",          func: "charge",     ignore:false,options:{min:-200,max:10,step:5}},
            {controltype: "range",       datatype: "number",   default: 1,tab:"Global",label: "Link Strength",   func: "strength",    ignore:false,options:{min:0,max:1,step:.01}},
            {controltype: "range",       datatype: "number",   default:30 , tab:"Global",label: "Distance",       func: "distance",    ignore:false,options:{min:0,max:100,step:1}},
	    
            
        ];

        var circularLayoutControlsObj = [
	    {controltype: "range",       datatype: "number", default:30,  tab:"Global",label: "Text radius",  func: "textRadius",     ignore:false,options:{min:10,max:100,step:1}},
            
	];
        
        var chordLayoutControlsObj = [
            {controltype: "select",      datatype: "number",     tab: "Node", label: "Chord Attribute",      func: "nodeAcessor", ignore:false},
           
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
                return chordLayoutControlsObj;
                break;    
            }
        }

    })
