angular.module("MyApp")
        .service('modalCtrlProvider', function() {
          
            this.getCtrl = function(type)
            {
                if(modalControllers[type] ==='undefined')
                {
                  return   codingError("Unknown Modal Controller asked")
                }
            return  modalControllers[type];          
            }
        });

