/* Copyright 2014 Tera Insights, LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

/* This file contains globaly useful features. Needs to be loaded
 * before any other file in this package
*/

// create the dc object if it does not exist
if (typeof dc=='undefined')
    dc = {};



/* Tooltip that we can use globally.

   This tooltip is attached to the entire page. This should not be a
   problem since the tooltip is displayed only at the mouse position.


   Code inspired from: http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html and https://github.com/jprichardson/d3-tooltip/blob/master/lib/d3-tooltip.js
*/

dc.tooltip = {
    /* node: gets crated by init */

    // call this function, if you can once the 'body' is built
    init: function(){
        dc.tooltip.node = d3.select('body').append('div')
            .attr('id', "dc-tooltip")
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('pointer-events', 'none')
            .style('z-index', '100')
            .classed('tooltip',true)
    },
        // set content of tooltip
    html: function(_){
        if (!dc.tooltip.node)
            dc.tooltip.init();
        dc.tooltip.node.html(_);
        return dc.tooltip;
    },
    // show tooltip, call in mouseover
    show: function(event, delay){
        if (dc.tooltip.node.html() === ""){
            //empty tooltip, make sure nothing gets displayed
            dc.tooltip.node.style('opacity', 0);
        }
        if (!event) event = d3.event; // if no provided event, we ask d3
        if (dc.tooltip.node && event && event.pageX && event.pageY){
            delay = delay ? delay : 0;
            dc.tooltip.node.transition().duration(delay).style('opacity', 0.9);

            dc.tooltip.node
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY + 10) + 'px');
        }
    },
    // hide tooltip, call in mouseout
    hide: function(delay){
        if (dc.tooltip.node){
            delay = delay ? delay : 0;
            dc.tooltip.node.transition().duration(delay)
            .style('opacity', 0);
        }
    }
};


/* Context menu we can use globally. Modeled aftrer the tooltip
   Needs to be told what the current menu looks like and what actions it has

   Code based on Jacob Kelley's contextjs
*/

/* ORIGINAL COPYRIGHT
 * Context.js
 * Copyright Jacob Kelley
 * MIT License
 */

dc.contextmenu = {
    // recursive function to build the menus
    // used internally by menu; no not call from outisde
    // @menu: the menu datastructure
    // @submenu: if true than submenu
    recmenu: function(menu){
        menu.each( function(d){
            var menuel = d3.select(this)
                .append('ul')
                .attr('class', "dropdown-menu");

            var menuit = menuel
                .selectAll('li')
                .data(d)
                .enter().append('li')
                .attr("class", function(d,i){
                    if (d.divider) return "divider";
                    if (d.submenu) return "dropdown-submenu";
                    if (d.header) return "nav-header";
                    return "";
                });

            menuit.filter(function(d) { return d.menu !== undefined; })
                .append('a')
                .text(function(d,i){ return d.menu;})
                .attr("tabindex", "-1")
                .on("click", function(d,i){
                    // call the function with the args
                    d.fct.apply(d, d.args);
                    $("#dc-contextmenu").hide();
                })
            ;

            menuit.filter(function(d) { return d.submenu !== undefined; })
                .each( function(d){
                    d3.select(this)
                    .append('a')
                    .text(function(d,i){ return d.submenu;})
                    .attr("tabindex", "-1");

                    d3.select(this)
                        .data([d.children])
                        .call(dc.contextmenu.recmenu);
                });
            menuit.filter(function(d){ return d.header !== undefined; })
                .text(function(d){ return d.header; })
            ;
        });
    },
    // call this function, if you can once the 'body' is built
    init: function(){
        dc.contextmenu.node = d3.select('body').append('div')
            .attr('id', "dc-contextmenu")
            .attr('class', "dropdown clearfix");

        dc.contextmenu.node
            .append('a')
            .attr('id', 'dc-contextmenu-toggle')
            .attr('data-toggle', 'dropdown');

    },
    // set content of contextmenu
    // argument is an array with elements of the form:
    //  { menu: name, fct: functionObj, args: [ a1, a2, ...] }
    // or { divider: true }
    // or { submenu: name, children: [ ... ] }
    menu: function(_){
        if (!dc.contextmenu.node)
            dc.contextmenu.init();

        // get rid of the current menu
        dc.contextmenu.node
            .select('ul')
            .remove();

        // link the new menu
        dc.contextmenu.node
            .data([_])
            .call(dc.contextmenu.recmenu);

        $("#dc-contextmenu-toggle").dropdown('toggle');

        return dc.contextmenu;
    },
    // show contextmenu, call in mouseover
    show: function(event){
        if (!event) event = d3.event; // if no provided event, we ask d3
        if (dc.contextmenu.node && event && event.pageX && event.pageY){
            dc.contextmenu.node
            .style('left', (event.pageX + 0) + 'px')
            .style('top', (event.pageY + 0) + 'px');
            $("#dc-contextmenu").show();
        }
    },
    // hide contextmenu, call in mouseout
    hide: function(delay){
        if (dc.contextmenu.node){
            $("#dc-contextmenu").hide();
        }
    }

};
