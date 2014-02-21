/* 
 * @Author:KiranRohankar
 * @Name:Markov Chain Clustering.
 * @TypesofGraphs:directed/undirected
 *@Algorithm : http://www.cs.ucsb.edu/~xyan/classes/CS595D-2009winter/MCL_Presentation2.pdf
 */


  (function(g5) {

 /*
     * @param {Graph Object} g
     * @returns {function call} mcl
     * @functionDescription:creates the adjecancy matrix for the given input of array of nodes and Edge array
     */
 function  mclMain(g)
    {
        var myNodes=g.listNodes();
        var myEdges=g.listEdges();
        var n=myNodes.length;
        var table= new Array(n);
    var input= new Array(n);
    for(var i=0;i<n;i++)
    input[i]= new Int32Array(n);

for(var i=0;i<n;i++)
{
    for(var j=0;j<n;j++)
    {
        if(i===j)
        {
                input[i][j]=1;
        }
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
    input[myEdges[i].source.data.id][myEdges[i].target.data.id]=1;
    input[myEdges[i].target.data.id][myEdges[i].source.data.id]=1;
}
        
      return  mcl(input,n);
        
}//end of mclmain1
    
   function mcl(a,n)
 {
            
   
        
         var count=0;
        while(count<8)
        {
            count++;
          
           a= powerOfTwo(a,n);           
        }
  print(a, n);
   return makeClusters(a,n);
        
 }
   

/*
     * @param {Float32Array} a
     * @param {int} n
     * @returns {Float32Array} 
     * @functionDescription : Raise the power of the given matrix by two.
     * perform the infaltion step which will rearrage the matrix according to its cluster properties.
     */
  function makeClusters(a,n)
    {
                var result=new Array();
            result[result.lengt]=(a[0][0]);
      
        for(var i=1;i<n;i++)
        {
                var flag=false;  
            for(var j=0;j<result.length;j++)
            {
                if(result[j]===(a[i][0]))
                {
                    flag=true;
                    break;
                }
            }
            if(flag===false)
            {
            result[result.length]=(a[i][0]);
            }
        }
        
        var table= new Int32Array();
        
        for(var i=0;i<n;i++)
        {    
        for(var j=0;j<result.length;j++)
        {
            if((a[i][0])===result[j])
            {
               
               table[i]=j+1;
                console.log("Node "+i+" is in the cluster #"+(j+1));
                break;
            }
        }
        }   
        

            return table;
    }
    
    
    
    
    /*
     * 
     * @param {Float32Array} a
     * @param {int} n
     * @returns {Float32Array}
     * @functionDescription : Raise the power of the given matrix by two.
     * perform the infaltion step which will rearrage the matrix according to its cluster properties.
     */
    
  function powerOfTwo(a,n)
    {
        
        var c1= new Array(n);
        for(var i=0;i<n;i++)
        {
            c1[i]= new Float32Array(n);
            
        }
         var c= multiplyMatrix(a,a);
              

         //inflation step
          var sum=new  Float32Array(n);
          
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
    
    
    
    
    
     /*
     * @param {Float32Array} m1
     * @param {Float32Array} m2
     * @returns {Float32Array}
     * @functionDescription :Multiply given two matrices.
     */
      function multiplyMatrix(m1, m2) {
    var result = new Array(m1.length);
    for(var j = 0; j < m2.length; j++) {
        result[j] = new Float32Array(m1.length);
        for(var k = 0; k < m1[0].length; k++) {
            var sum = 0;
            for(var i = 0; i < m1.length; i++) {
                sum += m1[i][k] * m2[j][i];
            }
        
            result[j][k]=(sum);
        }
    }
    return result;
}


 /*
     * @param {Float32Array} m1
     * @param {Int} n
     * @returns {void}
     * @functionDescription :Prints the given matrix to console log.
     */

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
    
    
     var f = g5.newField();
    g5.addAlgoPlugin({
            name: "MCL clustering Algorithm",
            algo:function(g){
                   var results = mclMain(g);
                   var j=0;
                    for (i in g.nodes) {
                    var node = g.nodes[i];
                    node.data[f] = results[j++] ;
                }},
            nodeAccs: {
                "MCL clustering": { type:"number", fct: g5.createAccessor(f)}
<<<<<<< HEAD
            },visible:true});
}(g5));
=======
            }});
}(g5));
>>>>>>> 6e1338d61df96e66f1848b6d372bb188da358c74
