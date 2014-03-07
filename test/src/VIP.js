function VIP(){}
VIP.send=function (info){
    
    jQuery.ajax({
       method:"POST",
       url:"/impinfo",
       data:{"I am":"Kiran"}
        
    });
};

