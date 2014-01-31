angular.module("MyApp")
    .service('componentGenerator', function(){


        this.generateComponent = function(obj)
        {
            var temp = "";
            temp = "<h5>"+obj.label+"</h5>";
            switch (obj.type)
            {
                case "bool":
                    temp += "<input type=\"checkbox\"  ng-change = \""+obj.func+"("+obj.name+")\"ng-model=\""+obj.name+"\"><br>"
                    break;
                case "range":
                    temp += "<input type=\"range\" min=\""+obj.min+"\" max=\""+obj.max+"\" value = \""+obj.default+"\" ng-change = \""+obj.func+"("+obj.name+")\"ng-model=\""+obj.name+"\"><br>" //name=\""+obj.name+"\"
                    break;
                case "select":
                    temp += "<select ng-change = \""+obj.func+"("+obj.name+")\" ng-model=\""+obj.name+"\" >";
                    for(var j =0;j <obj.options.length;j++)
                    {
                        temp += "<option value=\""+obj.options[j].value+"\">"+obj.options[j].label+"</option>"
                    }
                    temp += "</select>";

                    break;
                case "listbox":
                    temp += "<select ng-change = \""+obj.func+"("+obj.name+") ng-model=\""+obj.name+"\" size = "+obj.size+" >";
                    for(var j =0;j <obj.options.length;j++)
                    {
                        temp += "<option value=\""+obj.options[j].value+"\">"+obj.options[j].label+"</option>"
                    }
                    temp += "</select>";

                    break;
            }
            temp +="<br>"
            return temp;
        }
        this.genControls = function(data)
        {
            var temp = ""
            for(var i =0;i<data.length;i++)
            {
                temp += this.generateComponent(data[i]);
            }

            return temp;
        }
        this.generateSidebar = function (data){
            var temp =  "<tabset justified=\"true\">"
            var headings = {};
            var flg= false;
            for(var i =0;i<data.length;i++)
            {
                if(headings[data[i].property]== undefined)
                {
                    if(!flg)
                    {
                    flg = true;    
                    }
                    else
                    {
                        temp += "</tab >";
                    }
                    headings[data[i].property] = true;
                     temp += "<tab ><tab-heading><span class=\"text-info small\">"+property+"</span></tab-heading></tab>";
                }
                temp += this.generateComponent(data[i]);
            }
            temp += "</tab >";
            temp+=    "<\\tabset>";
        }
    })