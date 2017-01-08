function Camera(){
    const v4l2camera = require("v4l2camera");
    const Promise = require("promise");
    const childProcess = require('child_process');
    const self = this;
    var instance = null;
    function sharedObject(){
        if(instance)return instance;
        instance = self;
        self.format = function(exposure,gain){
            return new Promise((resolve)=>{
                childProcess.exec("ls /dev/video*",function(err, stdout, stderr){
                    if(stdout&&stdout.indexOf("/dev/video")>-1){
                        var cmd = "v4l2-ctl -d "+stdout.split("\n")[0]+" -c exposure_auto_priority=0,gain="+gain+",exposure_absolute="+exposure;
                        childProcess.exec(cmd,function(err, stdout, stderr){
                            resolve();    
                        });
                    }else{
                        resolve();
                    }
                });
            });
        }
        self.capture = function(){
            return new Promise((resolve)=>{
                childProcess.exec("ls /dev/video*",function(err, stdout, stderr){
                    if(stdout&&stdout.indexOf("/dev/video")>-1){
                        const cam = new v4l2camera.Camera(stdout.split("\n")[0]);
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
            });
        }
        return self;
    }
    return {
        sharedObject:sharedObject
    }
}
module.exports = new Camera();