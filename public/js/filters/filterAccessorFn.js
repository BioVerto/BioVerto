angular.module("MyApp")
  .filter('functionFilter', function() {
  return function(acessorfns,type) {
      switch (type){
          case 'character':
              return acessorfns;
          case 'number':
              var results={};
              for(i in acessorfns)
              {
                  if(acessorfns[i].returnType==="number" || acessorfns[i].returnType==="integer" || acessorfns[i].returnType==="double")
                  {
                      results[i]=acessorfns[i];
                  }
              }
              return results;
      }
  };
});