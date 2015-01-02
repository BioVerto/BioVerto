angular.module("MyApp")
        .service('componentGenerator', function() {

            this.generateComponent = function(obj, options,number)
            {
                if (obj.ignore)
                {
                    return "";
                }
                 obj.name = "P"+number;
                var temp = "";
                temp = "<div style='padding-bottom: 10px; padding-top: 10px;'><a class='pull-left'>" + obj.label + "</a>";
                switch (obj.controltype)
                {
                    case "colorpicker":
                        temp += "<button ng-init=\"data." + obj.name + "='" + obj.default + "'\" class='pull-right btn-xs' colorpicker ng-model=data." + obj.name + " style='background-color: {{data." + obj.name + "}}' ng-change = 'view." + obj.func + "(data." + obj.name + ")' class='btn btn-primary'>Change color</button>"
                        break;
                    case "bool":
                        temp += "<input type='checkbox' ng-change = '" + obj.func + "(data." + obj.name + ")' ng-model='data." + obj.name + "'><br>"
                        break;
                    case "range":
                        temp += "<input type='range' min='" + obj.options.min + "' max='" + obj.options.max +"'  ng-init=\"setNumber('" + obj.func + "'," + obj.default + "); data."+obj.name + "=" + obj.default +"\"" +
                                "' ng-change = setNumber('" + obj.func + "',data." + obj.name + ") ng-model='data." + obj.name + "'step='" + obj.options.step + "' class ='pull-right'></input>" //name=\""+obj.name+"\"
                        break;
                    case "select":
                        temp += "<select ng-init = \"view." + obj.func + "(getAcessorFunction('" + obj.tab + "','" + obj.default + "'))\"  class='pull-right' ng-options=\"key as key for (key , value) in acessorFns['" + obj.tab + "']|functionFilter:'"+obj.datatype+"'\" ng-change = \"view." + obj.func + "(getAcessorFunction('" + obj.tab + "',data." + obj.name + "))\" ng-model=\"data." + obj.name + "\" >";
                        temp += "<option value = Reset n> Reset </option>"
                        temp += " <option value=''>None</option>";
                        temp += "</select>";
                        break;
                        
                }
                temp += "</div><br> "
                return temp;
            }
            this.genControls = function(data)
            {
                var temp = ""
                for (var i = 0; i < data.length; i++)
                {
                    temp += this.generateComponent(data[i]);
                }

                return temp;
            };
            this.generateSidebar = function(data, acessorFns) {
                var temp = "<tabset justified=\"true\">";
                var tabTitles = [];
                for (var i = 0; i < data.length; i++)
                {
                    if (tabTitles.indexOf(data[i].tab) === -1)
                    {
                        if (tabTitles.length !== 0)
                        {
                            temp += "</tab >";
                        }

                        temp += "<tab ><tab-heading><span class=\"text-info small\">" + data[i].tab + "</span></tab-heading>";
                        tabTitles.push(data[i].tab);
                    }
                    temp += this.generateComponent(data[i], acessorFns[data[i].tab],i);
                }
                temp += "</tab >";
                temp += "</tabset>";
                return temp;
            };
        })
