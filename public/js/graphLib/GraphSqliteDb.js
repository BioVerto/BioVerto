
var GraphSqliteDb = function(_db) {
this.db = _db;

};

GraphSqliteDb.prototype = {
    numNode:function(){

    },
    numEdges:function(){

    },
    makeObjectFromDbResults:function(queryResults){
            var results = [];
            for(var i in queryResults.values){
                results.push(_.object(queryResults.columns,queryResults.values[i]));
            }
            return results;
    },
    nodeObject:function(){
        return this.makeObjectFromDbResults(this.db.exec("SELECT `id` FROM `node`")[0]);
    },
    edgeObject:function(){
        return this.makeObjectFromDbResults(this.db.exec("SELECT `id`,`Source`,`Target` FROM `edge`")[0]);
    },
    getMin:function(attribute,table){
        return this.db.exec("SELECT MIN( `" +attribute+"`)  FROM "+table+"")[0].values[0][0];
    },
    getMax:function(attribute,table){
        return this.db.exec("SELECT MAX( `" +attribute+"`)  FROM "+table+"")[0].values[0][0];
    },
    getRange:function(attribute,table){
       return {
         max:this.getMax(attribute,table),
         min: this.getMin(attribute,table)};
    },
    getAllRows:function(attribute,table){
        var results = this.db.exec("SELECT `id`,`" +attribute+"`  FROM "+table+" ");
        return _.object(results[0].values);
    },
    getOneRow:function(attribute,table,id){
        var results = this.db.exec("SELECT `" +attribute+"`  FROM "+table+" WHERE id = " + id);
        return results[0].values[0][0];
    },
    getIdsForFilter:function(table,filter){
        var result = this.db.exec("SELECT id FROM "+table+" WHERE "+filter)[0];
        if(result){
            return _.flatten (result.values);
        }
        else{
            return [];
        }

    },
    updateRow : function(attribute,table, id,value){
        this.db.exec("UPDATE "+table+" SET " + attribute + " =" + value + " WHERE id = " + id);
    },
    updateAllRows : function(attribute,table,values){
        var stmt = this.db.prepare("UPDATE "+table+" SET " + attribute + " = ? WHERE id = ?");
        for(var i = 0; i<values.length;i++){
            stmt.run([values[i], i]);
        }
    },
    addColumn : function(name,table,datatype){
        this.db.run("ALTER TABLE `"+table+"` ADD `" + name + "` " +datatype);

    }
};
