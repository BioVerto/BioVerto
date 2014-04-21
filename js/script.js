/* Global functions used throught the code */

// function to bring elements in groups to front                                                                                                                                                                   
// depends on jquery ui draggable stack manipulation (should be the same)                                                                                                                                          
// source: http://urbanoalvarez.es/blog/2013/01/21/jqueryui-draggable-bring-stack-element-to-front-on-click/                                                                                                       
// this is just a rewrite of jquery code that implements stacks.                                                                                                                                                   
function bringFront(elem, stack){
    // Brings a file to the stack front                                                                                                                                                                            
    var min, group = $(stack);

    if(group.length < 1) return;
    min =0;
    $(group).each(function(i) {
        this.style.zIndex = min + i;
    });

    if(elem == undefined) return;
    $(elem).css({'zIndex' : min + group.length});
}
var loggedUser = null;
var logged = false;
/* global error function*/
var debugMode = false;
function codingError(text){
   if(debugMode)
   {
    alert("Error: " + text);
   }
   else
   {
    console.log("Error: " + text);      
   }
}

loadFile = function(file, callback)
            {
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    return callback;
                })(file);
                reader.readAsText(file);
            }
var BioVertoPath = "http://datapath.cise.ufl.edu:1080/BioVerto-data";      
var asanaPHPPath = "http://pranaowalekar.in/kartik/a.php";      

/* Start the app */
var app= angular.module("MyApp", ['ngSanitize','ui.bootstrap','ngGrid','colorpicker.module','ui.unique'])
app.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file):|data:image\//);
       
    }
]);

$(document).ready( function() {
    $('#myCarousel').carousel({
    	interval:   6000
	});
	
	var clickEvent = false;
	$('#myCarousel').on('click', '.nav a', function() {
			clickEvent = true;
			$('.nav-pills li').removeClass('active');
			$(this).parent().addClass('active');		
	}).on('slid.bs.carousel', function(e) {
		if(!clickEvent) {
			var count = $('.nav-pills').children().length -1;
			var current = $('.nav-pills li.active');
			current.removeClass('active').next().addClass('active');
			var id = parseInt(current.data('slide-to'));
			if(count === id) {
				$('.nav-pills li').first().addClass('active');	
			}
		}
		clickEvent = false;
	});
});
var generateFilterFunction = function (a)
{
    var bodyStr = "\"return ";
    for (i = 0; i < a.length; i+=2) {
        bodyStr+="aFn"+(i/2)+"(d)"+" "+a[i]+" "+a[i+1]+" && ";
    }
    bodyStr+="true;\"";
    //console.log(bodyStr);
    var argList="";
    for (i = 0; i < a.length; i+=2) {
        argList+="\"aFn"+(i/2)+"\",";
    }
    argList += "\"d\",";;
//    console.log(argList);
//    console.log("var fn= new Function("+argList+bodyStr+")");
    eval("var fn= new Function("+argList+bodyStr+")")
    return fn;
}
