angular.module("MyApp")
    .service('graphQuery', function(){
this.getGraphData = function(idx)
{
    return  [
        {width: 10, color: 23},{width: 15, color: 33},
        {width: 30, color: 40},{width: 50, color: 60},
        {width: 80, color: 22},{width: 65, color: 10},
        {width: 55, color: 5},{width: 30, color: 30},
        {width: 20, color: 60},{width: 10, color: 90},
        {width: 8, color: 10}
    ];
}
this.getViewData = function(idx)
{
/*
 return [
 {type:"bool", name:"P1",property:"color",label:"Parameter 1"},
 {type:"range", name:"P2",label:"Parameter 2",min:0,max:20,default:10},
 {type:"select", name:"P3",label:"Parameter 3",options:[{value:"Option1",label:"Option One"},{value:"Option2",label:"Option Two"},{value:"Option3",label:"Option Three"}]},
 {type:"listbox", name:"P3",label:"Parameter 3",size:4,options:[{value:"Option1",label:"Option One"},{value:"Option2",label:"Option Two"},{value:"Option3",label:"Option Three"}]}
 ];
     */
        return [{type:"bool",name:"P1",property:"generate-bars",label:"Generate Bars"},
            {type:"range", name:"P2",  property:"width-range" ,label:"Width Range",min:0,max:10,default:5},
            {type:"select",name:"P3",property:"color",label:"Color",options:[{value:"red",label:"Red"},{value:"green",label:"Green"},{value:"blue",label:"Blue"}]},
             ];




}
    })