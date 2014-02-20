angular.module("MyApp")
        .controller('mainController', function($scope, $modal, modalCtrlProvider, $http) {
            $scope.views = {};
            $scope.active = 0;
            $scope.newViewIndex = 0;
            $scope.bugreportDisable = false;
            $scope.imgdata;
            $scope.addView = function(layout, graphName)
            {
                if ($scope.newViewIndex !== 0 && typeof graphName === 'undefined')
                {
                    graphName = $scope.views[$scope.active].graphName;
                }
                ;
                $scope.views[$scope.newViewIndex] = {layout: layout, title: "New View " + $scope.newViewIndex, graphName: graphName, indx: $scope.newViewIndex};
                $scope.newViewIndex++;
            };
           
            $scope.removeView = function(index)
            {
                // First delete this view
                delete $scope.views[index];
                // Select another view to be the active view
                // Simply pick the first view available
                // This is ugly but effective. There is no API to do this
                for (var i in $scope.views) {
                    $scope.changeView(i);
                    return; // we got the first one
                }
                $scope.newViewIndex = 0;
            }
            $scope.changeView = function(indx)
            {
                $scope.active = indx;
            }
            $scope.fileUpload = function(plugin)
            {
                $scope.fileType;
                $scope.fileData;
                $scope.fileName;
                var modalInstance = $modal.open({
                    templateUrl: './partials/' + plugin + 'FileOpen.html',
                    controller: modalCtrlProvider.getCtrl(plugin),
                });
                modalInstance.result.then(function(newGraph) {

                }, function() {

                    return;
                });
            };
            $scope.contactUs = function()
            {
                var modalInstance = $modal.open({
                    templateUrl: './partials/contactUs.html',
                    controller: modalCtrlProvider.getCtrl("contactUs"),
                });
                modalInstance.result.then(function() {

                }, function() {
                    return;
                });
            }

            $scope.reportBug = function()
            {
                $scope.bugreportDisable = true;
                $scope.alertShow = true;
                $('html,body').css('cursor', 'crosshair');
                inspectElement(document, function(e) {
                    $scope.takeImage(e);
                    var modalInstance = $modal.open({
                        templateUrl: './partials/feedback.html',
                        controller: modalCtrlProvider.getCtrl("feedback"),
                    });
                    modalInstance.result.then(function(obj) {
                        $('body').find('.screenShotTempCanvas').remove();
                        $('body').find('svg').show();
                        $http.post(asanaPHPPath, {imgdata: $scope.imgdata, name: obj.name,email:obj.eid,detail:obj.detail});

                    }, function() {
                        $('body').find('.screenShotTempCanvas').remove();
                        $('body').find('svg').show();
                      
                        return;
                    });
                }, function() {
                    console.log("asd");
                    $('html,body').css('cursor', 'auto');
                })
            }
            $scope.alertClose = function()
            {
                $scope.alertShow = false;
            }

            $scope.databaseDownload = function(plugin)
            {
                var modalInstance = $modal.open({
                    templateUrl: './partials/' + plugin + 'DBOpen.html',
                    controller: modalCtrlProvider.getCtrl(plugin),
                });
                modalInstance.result.then(function(newGraph) {

                    $scope.addView(newGraph.layout, newGraph.graphName);
                }, function() {
                    return;
                });
            }
                $scope.takeImage = function(e) {
                var svgElements = $('body').find('svg');
                svgElements.each(function() {
                    var canvas, xml;
                    canvas = document.createElement("canvas");
                    canvas.className = "screenShotTempCanvas";
                    //convert SVG into a XML string
                    xml = (new XMLSerializer()).serializeToString(this);
                    // Removing the name space as IE throws an error
                    xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');
                    //draw the SVG onto a canvas
                    canvg(canvas, xml);
                    $(canvas).insertAfter(this);
                    //hide the SVG element
                    this.className = "tempHide";
                    $(this).hide();
                });
                html2canvas(document.body, {
                    onrendered: function(canvas) {

                        var ctx = canvas.getContext('2d');
                        // ctx.drawImage(pinImage, e.pageX, e.pageY);

                        ctx.beginPath();
                        var startingX = e.pageX - 10 , startingY = e.pageX -130;


                        ctx.moveTo(startingX, startingY);
                        ctx.bezierCurveTo(startingX - 16, startingY - 20, startingX + 32, startingY - 21, startingX + 17, startingY );

                        ctx.moveTo(startingX, startingY)
                        ctx.bezierCurveTo(startingX + 12, startingY + 39, startingX + 16, startingY - 8, startingX + 17, startingY );
                        ctx.closePath();
                        ctx.fillStyle = 'red';
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(startingX +9, startingY-5, 5, 0, 2 * Math.PI);
                        ctx.stroke();
                         ctx.fillStyle = 'black';
                        ctx.fill();
                        var img = canvas.toDataURL("image/png");
                        img = img.substr(img.indexOf(',') + 1).toString();
                        $scope.imgdata = img;
                        $scope.bugreportDisable = false;
                        $scope.alertShow = false;
                        $scope.$digest();
                        $('html,body').css('cursor', 'auto');

                    }
                }
                );
            };

        });


