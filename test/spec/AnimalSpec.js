describe("Animal",function (){
    
 it("Should have 6 legs if its an insect",function (){
   var insect= new Animal();  
     insect.kind= "insect";
     expect(insect.numLegs()).toBe(6);
 });
 
     
 it("Should have 8 legs if its a spider",function (){
   var spider= new Animal();  
     spider.kind= "spider";
     expect(spider.numLegs()).toBe(8);
 });  
 
 it("Legs are undefined if its a milipad", function (){
    var milipad= new Animal();
    milipad.kind="milipad";
        expect(milipad.numLegs()).toBeUndefined();
 });
});

