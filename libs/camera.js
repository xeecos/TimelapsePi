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
                        var cmd = "v4l2-ctl -p 1 -d "+stdout.split("\n")[0]+" --set-fmt-video=width=1280,height=960,pixelformat=0 -c exposure_auto=1,exposure_auto_priority=0,gain="+gain+",exposure_absolute="+exposure;
                        childProcess.exec(cmd,function(err, stdout, stderr){
                            resolve();    
                        });
                    }else{
                        resolve();
                    }
                });
            });
        }
	self.cam = null;
	self.isOpen = false;
        self.capture = function(){
            return new Promise((resolve)=>{
		if(self.isOpen){resolve();return;}
                childProcess.exec("ls /dev/video*",function(err, stdout, stderr){
                    if(stdout&&stdout.indexOf("/dev/video")>-1){
			self.cam = new v4l2camera.Camera(stdout.split("\n")[0]);
                        if (self.cam.configGet().formatName !== "MJPG") {
                            resolve();
                            return;
                        }
                        try{
                            self.cam.start();
                            self.isOpen=false;
			    console.log("starting")
			    self.cam.capture(function (success) {
                                var frame = self.cam.frameRaw();
                                self.cam.stop();
				self.isOpen = true;
				console.log("success:",success)
                                resolve(Buffer(frame));
                            });
                        }catch(err){
                            console.log(err);resolve();
                        }
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
