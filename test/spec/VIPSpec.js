describe ("very inportant function",function (){
   it("should be send",function (){
       spyOn(jQuery,"ajax");
       VIP.send("I am kiran");
       expect(jQuery.ajax).toHaveBeenCalledWith({
                   method:"POST",
                   url:"/impinfo",
                   data:{"I am":"Kiran"}
                   
               });
       
       
   });
});
