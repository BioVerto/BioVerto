angular.module("MyApp")
    .service('configurationService', function() {

        var forceLayoutControlsObj = [
           
            {controltype: "select",      datatype: "character", tab: "Node", label: "Node Label",      func: "nodeLabelAcessor",ignore:false},
            {controltype: "select",      datatype: "number",    tab: "Node", label: "Node Size",       func: "nodeSizeAcessor", ignore:false},
            {controltype: "range",       datatype: "number",     tab:"Node",label: "Min node size",    func: "minNodeSize",    ignore:false,options:{min:5,max:40,default:10,step:1}},
            {controltype: "range",       datatype: "number",     tab:"Node",label: "Max node size",    func: "maxNodeSize",    ignore:false,options:{min:10,max:40,default:15,step:1}},
	    {controltype: "select",      datatype: "number",     tab: "Node", label: "Color Attribute",func: "nodeColorAcessor", ignore:false},
            {controltype: "colorpicker", datatype: "color",     tab: "Node", label: "Cold Color",      func: "minNodeColor",      ignore:false,options:{default:"#9674cf"}},
            {controltype: "colorpicker", datatype: "color",      tab: "Node", label: "Hot Color",      func: "maxNodeColor",      ignore:false,options:{default:"#CC0033"}},            

            {controltype: "select",      datatype: "number",    tab: "Edge", label: "Edge Size",       func: "edgeWidthAcessor", ignore:false},
            {controltype: "range",       datatype: "number",     tab:"Edge",label: "Min Edge size",    func: "minEdgeWidth",    ignore:false,options:{min:2,max:10,default:2,step:1}},
            {controltype: "range",       datatype: "number",     tab:"Edge",label: "Max Edge size",    func: "maxEdgeWidth",    ignore:false,options:{min:2,max:10,default:5,step:1}},
            {controltype: "select",      datatype: "number",    tab: "Edge", label: "Edge Color ",     func: "edgeColorAccessor",ignore:false},
            {controltype: "colorpicker", datatype: "color",     tab: "Edge", label: "Cold Color",      func: "minEdgeColor",      ignore:false,options:{default:"#9674cf"}},
            {controltype: "colorpicker", datatype: "color",      tab: "Edge", label: "Hot Color",      func: "maxEdgeColor",      ignore:false,options:{default:"#CC0033"}},            
            {controltype: "select",      datatype: "character", tab: "Edge", label: "Edge Label ",      func: "edgeLabelAcessor", ignore:true},

          
            {controltype: "range",       datatype: "number",    tab:"Global",label: "Charge",          func: "charge",     ignore:false,options:{min:-200,max:10,default:-120,step:5}},
            {controltype: "range",       datatype: "number",    tab:"Global",label: "Link Strength",   func: "strength",    ignore:false,options:{min:0,max:1,default:1,step:.01}},
            {controltype: "range",       datatype: "number",     tab:"Global",label: "Distance",       func: "distance",    ignore:false,options:{min:0,max:100,default:30,step:1}},
	    
            
        ];

        var circularLayoutControlsObj = [
	    {controltype: "range",       datatype: "number",   tab:"Global",label: "Text radius",  func: "textRadius",     ignore:false,options:{min:10,max:100,default:30,step:1}},
            
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
