function Camera(){
    const v4l2camera = require("v4l2camera");
    const Promise = require("promise")
    const self = this;
    var instance = null;
    function sharedObject(){
        if(instance)return instance;
        instance = self;
        
        self.capture = function(){
            return new Promise((resolve=>{
                require('child_process').exec("ls /dev/video*",function(data){
                    if(data.indexOf("/dev/video")>-1){
                        const cam = new v4l2camera.Camera("/dev/video0");
                        if (cam.configGet().formatName !== "MJPG") {
                            resolve();
                            return;
                        }
                        cam.start();
                        cam.capture(function (success) {
                            var frame = cam.frameRaw();
                            cam.stop();
                            resolve(Buffer(frame));
                        });
                    }else{
                        resolve();
                    }
                })
            }))
        }
        return self;
    }
    return {
        sharedObject:sharedObject
    }
}
module.exports = new Camera();