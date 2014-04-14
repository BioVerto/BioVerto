angular.module("MyApp")
        .filter('sortViews', function() {
            var prevActiveView = 0;
            var orderedView = [];
            return function(views, active) {
                if (active !== prevActiveView||(Object.keys(views).length ===1))
                {
                    orderedView = [];
                    for (i in views)
                    {
                        if (parseInt(i) !== active)
                        {
                            orderedView.push(views[i]);
                        }
                    }
                    orderedView.push(views[active]);
                    prevActiveView=active;
                    
                    return orderedView;
                }
                else
                {
                    return orderedView;
                }
                return [];
            };
        });