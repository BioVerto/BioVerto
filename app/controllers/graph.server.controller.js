'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var d3Globa = require('d3')

var http = require('http')
var sql = require('sql.js');
var squel = require('squel');
var fs = require("fs");
var _ = require('underscore');
var Graph = mongoose.model('Graph');
var pg = require("pg");
var uniprotIds;
var path = require('path');
var organisms = ["Arabidopsis_thaliana",
    "Aspergillus_nidulans",
    "Bos_taurus",
    "Caenorhabditis_elegans",
    "Candida_albicans_SC5314",
    "Canis_familiaris",
    "Danio_rerio",
    "Dictyostelium_discoideum_AX4",
    "Drosophila_melanogaster",
    "Escherichia_coli",
    "Gallus_gallus",
    "Glycine_max",
    "Hepatitus_C_Virus",
    "Homo_sapiens",
    "Human_Herpesvirus_1",
    "Human_Herpesvirus_2",
    "Human_Herpesvirus_4",
    "Human_Herpesvirus_5",
    "Human_Herpesvirus_6",
    "Human_Herpesvirus_8",
    "Human_Immunodeficiency_Virus_1",
    "Human_Immunodeficiency_Virus_2",
    "Leishmania_major",
    "Macaca_mulatta",
    "Mus_musculus",
    "Neurospora_crassa",
    "Oryctolagus_cuniculus",
    "Plasmodium_falciparum_3D7",
    "Rattus_norvegicus",
    "Saccharomyces_cerevisiae",
    "Schizosaccharomyces_pombe",
    "simian_human_immunodeficiency_virus",
    "Strongylocentrotus_purpuratus",
    "Sus_scrofa",
    "Xenopus_laevis"]

    /**
 * Create a article
 */
exports.listGraph = function(req, res) {
    Graph.find().sort('-created').exec(function(err, articles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(articles);
        }
    });
}

exports.getDb = function(req, res){
    var filePath = path.join(req.query.dbFile);
    var stat = fs.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'bin/db',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
}


exports.makeBiogriddb = function(req, res) {

    res.send("Making Biogrid Dbs");
    var nodeProperties = ["entrez gene interactor","biogrid id interactor","systematic name interactor","official symbol interactor","synonyms interactor"];
    var nodeName=[" a"," b"];
    var edgeProperties =["biogrid interaction id","pubmed id","experimental system","experimental system type","author"];

    var conString = "pg://postgres:qwerty@localhost:5432/test";
    var client = new pg.Client(conString);
    client.connect();
    for (var i =0;i < organisms.length;i++) {
        (function (currOrganism){

        var query = client.query("SELECT * FROM test.biogrid." + currOrganism);
        query.on("row", function (row, result) {
            if(row["biogrid interaction id"] == "719456"){
                debugger;
            }
            if (!result.edges) {
                result.edges = [];
                result.nodes = [];
                result.nodeIds = {};

            }

            for (var i = 0; i < nodeName.length; i++) {
                if (!result.nodeIds[row["entrez gene interactor" + nodeName[i]]]) {
                    var temp = {};
                    for (var j = 0; j < nodeProperties.length; j++) {
                        temp[nodeProperties[j]] = row[nodeProperties[j] + nodeName[i]]
                    }
                    result.nodes.push(temp);
                    result.nodeIds[row["entrez gene interactor" + nodeName[i]]] = result.nodes.length;

            }
            }
            var temp = {};
            for (var j = 0; j  < edgeProperties.length; j++) {
                temp[edgeProperties[j]] = row[edgeProperties[j]]
            }
            temp["Source"] = result.nodeIds[row["entrez gene interactor a"]];

            temp["Target"] = result.nodeIds[row["entrez gene interactor b"]];

            if(!temp["Source"] ||!temp["Target"]){
                debugger;
            }
            result.edges.push(temp);
        })


        query.on("end", function (result) {
            var db = new sql.Database();
            var createNodeQuery = "create table 'node' ('id' integer  not null primary key ";
            var createAttributeQuery = "create table 'attribute' ('id' integer not null primary key autoincrement , 'name' 'varchar' ,'datatype' 'varchar','type' 'varchar', 'attributes' 'varchar')";
            db.exec(createAttributeQuery);
            for (var i = 0; i < nodeProperties.length; i++) {
                createNodeQuery += " , '" + nodeProperties[i] + "' varchar";
            }
            createNodeQuery += " )"
            db.exec(createNodeQuery);

            for (var i = 0; i < nodeProperties.length; i++) {
                var  sqlStatement = squel.insert({ autoQuoteTableNames: true, autoQuoteFieldNames: true }).into('attribute').setFields({name:nodeProperties[i],datatype:"character",type:"node",attributes:""}).toString();
                db.exec(sqlStatement);
            }
            for (var i = 0; i < edgeProperties.length; i++) {
                var  sqlStatement = squel.insert({ autoQuoteTableNames: true, autoQuoteFieldNames: true }).into('attribute').setFields({name:edgeProperties[i],datatype:"character",type:"edge",attributes:""}).toString();
                db.exec(sqlStatement);
            }

            var createEdgeQuery = "create table 'edge' ('id' integer not null primary key ,'Source' 'INTEGER','Target' 'INTEGER'";
            for (var i = 0; i < edgeProperties.length; i++) {

                createEdgeQuery += " , '" + edgeProperties[i] + "' varchar";
            }
            createEdgeQuery += " )"
            db.exec(createEdgeQuery);
            var sqlStatement;
            console.log(currOrganism + " : numNode :" + result.nodes.length+" numEdges: " +result.edges.length );
            for (var o in result.nodes) {

                sqlStatement = squel.insert({ autoQuoteTableNames: true, autoQuoteFieldNames: true }).into('node').setFields(result.nodes[o]).set("id",o).toParam();
                db.run(sqlStatement.text, sqlStatement.values);

            }
            for (var o in result.edges) {

                sqlStatement = squel.insert({ autoQuoteTableNames: true, autoQuoteFieldNames: true }).into('edge').setFields(result.edges[o]).set("id",o).toParam();
                db.run(sqlStatement.text, sqlStatement.values);

            }
            saveDb(currOrganism, "BioGrid", db);
            db.close();
            });

    }(organisms[i]));
    }


}

exports.deleteDbs = function(req, res){
    Graph.find({ }).remove().exec();
    res.send("Deleted Dbs in Mongo");
}
exports.makeMintdb = function(req, res) {
            res.send("Making Mint Dbs");
   // mongoose.connection.db.graphs.remove({});
    var uniprotIdText = fs.readFileSync("/home/kgc/BioVerto-data/MINT-full/uniprot.list").toString();
    uniprotIds = d3.csv.parseRows(uniprotIdText + "");
    var fileListText= fs.readFileSync('/home/kgc/BioVerto-data/rest/list/organism-all').toString();
                var fileList = []
                var rows = d3.csv.parseRows(fileListText);
                for (var i = 0; i < rows.length; i++) {
                    fileList.push({name: rows[i][0], fileName: rows[i][1]});
                }
                for (var j = 0; j < fileList.length; j++) {
                    console.log("num :"+ j);
                    var blob = fs.readFileSync("/home/kgc/BioVerto-data/MINT-full/" + fileList[j].fileName + "_all.graph").toString();
                    var db = makeDb(blob);
                    giveUniprotIds(db);
                    saveDb(fileList[j].name,"MINT",db);
                    db.close();
                }

}
function inserInMongodb(db,name,dbFilename,numNodes,numEdges,group){
    var graph = new Graph();
    graph.user = "admin";
    graph.title = name;
    graph.dbFile = dbFilename;
    graph.nodeAttribute = getGraphNodeAttributes(db);
    graph.edgeAttribute = getGraphEdgeAttributes(db);
    graph.numNodes = numNodes;
    graph.numEdges = numEdges;
    graph.dbGroup = group;
    graph.save(function(err) {
        if (err) {
            return ;
        } else {
           return;
        }
    });
}
function getGraphNodeAttributes(db){
    var attributes = db.exec("SELECT * FROM attribute WHERE type = 'node'")[0];
    var results = [];
    for(var i in attributes.values){
        results.push(_.object(attributes.columns,attributes.values[i]));
    }
    return results;
}
function getGraphEdgeAttributes(db){
    var attributes = db.exec("SELECT * FROM attribute WHERE type = 'edge'")[0];
    var results = [];
    for(var i in attributes.values){
        results.push(_.object(attributes.columns,attributes.values[i]));
    }
    return results;
}
function getDbAttribute(db,table,attribute){

    var results = _.flatten(db.exec(squel.select().from(table).field(attribute).toString())[0].values);
    return results;
}
function giveUniprotIds(db) {
    var nodes = getDbAttribute(db, "node", "name");
    var resultObjects = [];
    for (var i = 0; i < nodes.length; i++) {
    resultObjects.push({});
    }


    for (var i = 0; i < uniprotIds.length; i++) {
        var index = nodes.indexOf(uniprotIds[i][0]);
        if (index !== -1)
        {
            resultObjects[index][0] = uniprotIds[i][1];
            resultObjects[index][1] = uniprotIds[i][2];
            resultObjects[index][2] = uniprotIds[i][3];

        }
    }
    for (var i = 0; i < nodes.length; i++) {
        resultObjects[i][0] =  resultObjects[i][0] || "";
        resultObjects[i][1] =  resultObjects[i][1] || "";
        resultObjects[i][2] =  resultObjects[i][2] || "";

    }
    var u0 = _.pluck(resultObjects,0);
    var u1 = _.pluck(resultObjects,1);
    var u2 = _.pluck(resultObjects,2);
    console.log("num nodes:"+ nodes.length);
    console.log("done");
}
function writeAttribute(db,table,attribute,datatype,values){
    db.exec("ALTER TABLE"+table+" ADD" + attribute+" "+ datatype);
    var sqlStatement = squel.insert({ autoQuoteTableNames: true, autoQuoteFieldNames: true }).into(table).setField(attribute,"").toParam();
    for (var k = 0; k < values.length; k++) {
        db.run(sqlStatement.text, values[0]);
    }
}
function makeDb (blob){
    var blobWithHeaders = "Source\tTarget\tProbablity 1\tProbablity 2\ttaxid\n" + blob;
    var edges = d3.dsv("\t", "text/plain").parse(blobWithHeaders);
    var attributes = [{name:"Name",datatype:"character",type:"node",attributes:""},{name:"Probablity 1",datatype:"number",type:"edge",attributes:""},{name:"Probablity 2",datatype:"number",type:"edge",attributes:""}];
    var db = new sql.Database();
    db.exec("create table 'node' ('id' integer not null primary key, 'Name' varchar(255))");
    db.exec('create table "edge" ("id" integer not null primary key, "Source" INTEGER, "Target" INTEGER, "Probablity 1" INTEGER, "Probablity 2" INTEGER, "taxid" varchar(255))');
    db.exec( "create table 'attribute' ('id' integer not null primary key autoincrement , 'name' 'varchar' ,'datatype' 'varchar','type' 'varchar', 'attributes' 'varchar')");
    db.exec("update sqlite_sequence set seq = -1");
    var nodes = [];
    for (var k = 0; k < edges.length; k++) {
        var currEdge = edges[k];
        if(nodes.indexOf(currEdge.Source) == -1) {
        nodes.push(currEdge.Source);
        }
        if(nodes.indexOf(currEdge.Target) == -1) {
            nodes.push(currEdge.Target);
        }
        currEdge.Source = nodes.indexOf(currEdge.Source);
        currEdge.Target = nodes.indexOf(currEdge.Target);
        var sqlStatement = squel.insert({ autoQuoteTableNames: true, autoQuoteFieldNames: true }).into('edge').set("id",k).setFields(currEdge).toParam();
        db.run(sqlStatement.text, sqlStatement.values);
    }

    for (var k = 0; k < nodes.length; k++) {
        var sqlStatement = squel.insert({ autoQuoteTableNames: true, autoQuoteFieldNames: true }).into('node').set("Name", nodes[k]).set("id",k).toString();
        db.run(sqlStatement);
    }
    for (var k = 0; k < attributes.length; k++) {
        var sqlStatement = squel.insert({ autoQuoteTableNames: true, autoQuoteFieldNames: true }).into('attribute').setFields(attributes[k]).toString();
        db.exec(sqlStatement);
    }
    return db;
}
function saveDb(_fileName,_groupName,db){
    var data = db.export();
    var buffer = new Buffer(data);
    var numNodes = db.exec("SELECT COUNT(*) FROM node")[0].values[0][0];
    var numEdges = db.exec("SELECT COUNT(*) FROM edge")[0].values[0][0];

    if(numNodes>10) {
        var path = "./graphdbs/"+_groupName+":" + _fileName + ".sqlite"
        fs.writeFileSync(path, buffer);
        inserInMongodb(db, _fileName, path, numNodes, numEdges,_groupName);
    }

}