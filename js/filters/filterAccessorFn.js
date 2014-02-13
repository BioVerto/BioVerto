angular.module("MyApp")
  .filter('functionFilter', function() {
  return function(acessorfns,type) {
      if(type==='character')
      {
          return acessorfns;
      }
      else
      {
          var results={};
      for(i in acessorfns)
      {
          if(acessorfns[i].returnType===type)
          {
              results[i]=acessorfns[i];
          }
      }   
      return results;
     }
  };
});