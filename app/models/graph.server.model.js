'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var GraphSchema = new Schema({
    createdOn: {
        type: Date,
        default: Date.now
    },
    createdBy:{
        type:String,
        default:"admin"
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    numNodes:{
      type: Number,
      default:-1
    },
    numEdges:{
        type: Number,
        default:-1
    },
    dbFile: {
        type: String,
        default: '',
        trim:true,
        required:"Insert db File location"
    },
    dbGroup: {
        type: String,
        default: 'default',
        trim:true,
        required:"Insert db Group"
    },
    nodeAttribute:{
        type:Array,
        default:[]
    },
    edgeAttribute:{
        type:Array,
        default:[]
    }
});

mongoose.model('Graph', GraphSchema);