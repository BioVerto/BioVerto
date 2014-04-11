  (function(g5) {
 
  function powerOfTwo(a,n)
    {
        
        var c1= new Array(n);
        for(var i=0;i<n;i++)
        {
            c1[i]= new Array(n);
            
        }
      
              var c= multiplyMatrix(a,a);
              

         //inflation step
          var sum=new  Array(n);
          
          for(var i=0;i<n;i++)
          {
              var rowsum=0;
              for(var j=0;j<n;j++)
              {
               rowsum=rowsum+c[j][i];   
              }
              sum[i]=rowsum;
          }
         
          
        for(var i=0;i<n;i++)
        {
            for(var j=0;j<n;j++)
            {
                var d=c[i][j]/sum[j];
                
                c1[i][j]=d;
                
            }
        }
          
      a=c1;
     //   print(a,7);
       return c1;
    
         
       
    }
    
    function multiplyMatrix(m1, m2) {
    var result = [];
    for(var j = 0; j < m2.length; j++) {
        result[j] = [];
        for(var k = 0; k < m1[0].length; k++) {
            var sum = 0;
            for(var i = 0; i < m1.length; i++) {
                sum += m1[i][k] * m2[j][i];
            }
            result[j].push(sum);
        }
    }
    return result;
}
    //creates the adjecancy matrix for the given input of array of nodes and Edge array
    function  mclMain(g)
    {
        var myNodes=g.listNodes();
        var myEdges=g.listEdges();
        var n=myNodes.length;
        var table= new Array(n);
    var input= new Array(n);
    for(var i=0;i<n;i++)
    input[i]= new Array(n);

for(var i=0;i<n;i++)
{
    for(var j=0;j<n;j++)
    {
        if(i===j)
        {
                input[i][j]=1;
        }
        else
         input[i][j]=0;
    }
}

//create a dictionary for nodes so that I can get id associated with each node
for(var i=0;i<n;i++)
{
    table[myNodes[i].data.id]=i;
    
}
//create the adjecancy matrix for the graph
for(var i=0;i<myEdges.length;i++)
{
    input[table[myEdges[i].source.data.id]][table[myEdges[i].target.data.id]]=1;
    input[table[myEdges[i].target.data.id]][table[myEdges[i].source.data.id]]=1;
}
        
       return mcl(input,n);
}//end of mclMain
    
    function mcl(a,n)
    {
            
   
        
         var count=0;
        while(count<8)
        {
            count++;
            var val=isFine(a, n);
            if(val=== true)
            {
                print(a, n);
                 interpret(a, n);
                 break;
            }
            else
            {
           a= powerOfTwo(a,n);
               
                val=isFine(a, n);
                
             //   print(a, n);
                
            }
                
           
        }
  //print(a, n);
   return  makeClusters(a,n);
        
    }
    function makeClusters(a,n)
    {
        var result=[];
            result[result.length]=(a[0][0]).toFixed(2);
      
        for(var i=1;i<n;i++)
        {
                var flag=false;  
            for(var j=0;j<result.length;j++)
            {
                if(result[j]===(a[i][0]).toFixed(2))
                {
                    flag=true;
                    break;
                }
            }
            if(flag===false)
            {
            result[result.length]=(a[i][0]).toFixed(2);
            }
        }
        
         var table= new Array();
        
        for(var i=0;i<n;i++)
        {    
        for(var j=0;j<result.length;j++)
        {
            if((a[i][0]).toFixed(2)===result[j])
            {
                 table[i]=j+1;
                console.log("Node "+i+" is in the cluster #"+(j+1));
                break;
            }
        }
        }   
        
        return table;
            
    }
    
   function  isFine( a, n)
    {
        
      
      var c= new Array(n);
        for(var i=0;i<n;i++)
        {
            c[i]= new Array(n);
            
        }
        
         for(var i=0;i<n;i++)
        {
            for(var j=0;j<n;j++)
            {
              c[i][j]=a[i][j];  
               
              //  BigDecimal bd= new BigDecimal(a[i][j]);
               // c[i][j]= Double.parseDouble((bd.setScale(4, BigDecimal.ROUND_UP)).toString());
            }
        }
        
        var flag=false;
         for(var i=0;i<n;i++)
            {
                for(var j=0;j<n-1;j++)
                {
                    if(c[i][j]!==c[i][j+1])
                    {  
                        flag=true;
                        break;
                    }
                    }
                if(flag===true)
                {
                    break;
                }
            }
         if (flag===true)
         {
         return false;
         }
         else
         return true;
    }
    
    
  function  print( a, n)
    {
      
        for(var i=0;i<n;i++)
        {
            console.log("\n");
            for(var j=0;j<n;j++)
            {
             
               //  BigDecimal bd= new BigDecimal(a[i][j]);
               // a[i][j]= Double.parseDouble((bd.setScale(2, BigDecimal.ROUND_UP)).toString());
                console.log(" "+(a[i][j]).toFixed(2));
            }
        }
        console.log("\n\n\n\n");
        
      
    }
    var f = " ";
    g5.addAlgoPlugin({
            name: "MCL clustering Algorithm",
            algo:function(g){
                f = g.newField();
           
                var results = mclMain(g);
                   var j=0;
                    for (i in g.nodes) {
                    var node = g.nodes[i];
                    node.data[f] = results[j++] ;
                }},
            nodeAccs:function(){return  {
                "MCL clustering": { type:"number", fct: g5.createAccessor(f)}
            }},visible:true});
}(g5));