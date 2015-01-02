
var Graph = function(_graphObj,_db) {

    this.nodeAccessors = {};
    this.edgeAccessors = {};
    this.nCnt = 0;
    this.db = _db;
    this.numNodes = _graphObj.numNodes;
    this.numEdges = _graphObj.numEdges;
    this.nodes = this.db.nodeObject() ;
    this.edges = this.db.edgeObject();
    this.addInitialAccFunctions(_graphObj);
    this.graphObj = _graphObj;
};

Graph.prototype = {
    getState: function()
    {
        
        return {
            nodes:this.nodes,
            edges:this.edges,
            nodeAccessors:g5.stringifyAccessorFn(this.nodeAccessors),
            edgeAccessors:g5.stringifyAccessorFn(this.edgeAccessors),
            connectedComponentsNodes:this.connectedComponentsNodes,
            connectedComponentsEdges:this.connectedComponentsEdges,
            nCnt:this.nCnt
        };
    },
    resumeState:function(state)
    {
        this.nodes = state.nodes;
        this.edges = state.edges;
        this.nodeAccessors = g5.parseAccessorFn(state.nodeAccessors);
        this.edgeAccessors = g5.parseAccessorFn(state.nodeAccessors);
        this.connectedComponentsNodes=   state.connectedComponentsNodes;
        this.connectedComponentsEdges=   state.connectedComponentsEdges;
        this.nCnt = state.nCnt;
    },

    makeObjectFromDbResults:function(queryResults){
        var results = [];
        for(var i in queryResults.values){
            results.push(_.object(queryResults.columns,queryResults.values[i]));
        }
        return results;
    },
    getNodeData: function(){
       return  this.nodes;
    },
    getEdgeData: function(){
       return  this.edges;
    },

    /* Acessor Functions*/
    addNodeAccessor: function(name, type, fct) {
        if (this.nodeAccessors[name] !== undefined) {
            codingError("A node accessor with the name " + name + " is already present. Ignoring");
            return;
        }

        this.nodeAccessors[name] = fct; // HOW DOES THIS WORK? KARTIK THINKS IT DOES
        this.nodeAccessors[name].returnType = type; // ??catergorical or continuous // how to handle type information
        this.nodeAccessors[name].type = "Node";
    },
    addEdgeAccessor: function(name, type, fct) {
        if (this.edgeAccessors[name] !== undefined) {
            codingError("A edge accessor with the name " + name + " is already present. Ignoring");
            return;
        }
        this.edgeAccessors[name] = fct;
        this.edgeAccessors[name].returnType = type; // catergorical or continuous//Attach property to Function Object???
        this.edgeAccessors[name].type = "Edge";
    },
    createNodeAccessor: function(attribute,db) {
        return this.createAccessor(attribute,db,"node");
    },
    createEdgeAccessor: function(attribute,db) {

        return this.createAccessor(attribute,db,"edge");
    },
    createAccessor:function(attribute,db,type){
    var f = {
        cacheAllValues:function(){
            this.cachedValues = db.getAllRows(attribute,type);
        },
        deleteCache:function(){
            delete this.cachedValues;
        },
        getAll:function() {
            return db.getAllRows(attribute,type);
        },
        getOne:function(id){
            if(!this.cachedValues) {
                return db.getOneRow(attribute, type, id);
            }
            else{
                return this.cachedValues[id];
            }
        },
        getRange:function(){
            return db.getRange(attribute,type);
        }
    }
    return f;
    },
    newField : function() {
    return "_" + (this.nCnt++);
    },
    addInitialAccFunctions: function(_graphObj) {
        for(o in _graphObj.nodeAttribute){
            this.addNodeAccessor(_graphObj.nodeAttribute[o].name,_graphObj.nodeAttribute[o].datatype,this.createNodeAccessor(_graphObj.nodeAttribute[o].name,this.db));
        }
        for(o in _graphObj.edgeAttribute){
            this.addEdgeAccessor(_graphObj.edgeAttribute[o].name ,_graphObj.edgeAttribute[o].datatype,this.createEdgeAccessor(_graphObj.edgeAttribute[o].name,this.db));
        }

    },
    listNodeAccessors: function() {
        return this.nodeAccessors;
    },
    listEdgeAccessors: function() {
        return this.edgeAccessors;
    },
    listAlgorithms:function()
    {
        return g5.listAlgorithms();
    },
    addNodeAttribute:function(name,attributes) {
        this.db.addColumn(name,"node",attributes.datatype);
        this.db.updateAllRows(name,"node",attributes.data);
        this.graphObj.nodeAttribute[name] = attributes;
        this.addNodeAccessor(this.graphObj.nodeAttribute[name].name, this.graphObj.nodeAttribute[name].datatype, this.createNodeAccessor(this.graphObj.nodeAttribute[name].name, this.db));
    },
    addEdgeAttribute:function(name,attributes) {
        this.db.addColumn(name,"edge",attributes.datatype);
        this.db.updateAllRows(name,"edge",attributes.data);
        this.graphObj.edgeAttribute[name] = attributes;
        this.addEdgeAccessor(this.graphObj.edgeAttribute[name].name, this.graphObj.edgeAttribute[name].datatype, this.createEdgeAccessor(this.graphObj.edgeAttribute[name].name, this.db));
    }
    ,
    applyNodeFilter:function(filter){

            return this.db.getIdsForFilter("node",filter);

        },
    applyEdgeFilter:function(filter){
            return this.db.getIdsForFilter("edge",filter);
        }
};
