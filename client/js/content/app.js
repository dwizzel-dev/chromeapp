

window.onload = function() {
    logger.output("main window loaded");
    setTimeout(function(){
        client.connect('localhost', 3200);
    },1000);
}

// background page
var bgPage;
chrome.runtime.getBackgroundPage(function(page){
    bgPage = page;
    logger.output(bgPage);
});

// event logger
var logger = (function(){
    var output = function(str) {
      console.log(str);
    };
    var error = function(str) {
        console.error(str);
    };
    var warn = function(str) {
        console.warn(str);
    };
    return {
        output:output, 
        error:error, 
        warn:warn
    };
  })();
  
  // client
  
  var client = (function(){
    var socketId = 0;
    var tcp = chrome.sockets.tcp;
    var connect = function(host, port){
        var socketProp = {persistent: true, name:'tcptest', bufferSize: 256};
        tcp.onReceive.addListener(client.read);
        tcp.create(socketProp, function(creationInfos){
            logger.output(creationInfos);
            logger.output('socket created');
            socketId = creationInfos.socketId;
            if(socketId){
                tcp.connect(socketId, host, port, function(result){
                    if(result < 0){
                        logger.error('socket not connected');
                        var lastErr = chrome.runtime.lastError;
                        if(lastErr){
                            logger.output(lastErr.message);  
                        }
                    }else{
                        logger.output('socket connected');
                    }
                });
            }else{
                logger.error('socket not created');
            }
        })
    };

    var read = function(dataInfos){
        logger.output('receiving data');
        logger.output(dataInfos);
        logger.warn(dataInfos.data);
        logger.output(dataInfos.data);
        logger.output(buffer.from(dataInfos.data));
        client.write('àûôâ--yell back!');
    };

    var write = function(str){
        if(socketId){
            tcp.getInfo(socketId, function(socketInfos){
                if(socketInfos.connected){
                    tcp.send(socketId, buffer.to(str), function(result){
                        if(result.resultCode == 0){
                            logger.output('byte sent: ' + result.bytesSent);    
                        }else{
                            logger.error(result.resultCode);
                        }
                    });
                }else{
                    logger.error('socket not connected [1]');
                    logger.warn(socketInfos);        
                }
            });
        }else{
            logger.error('socket not connected [0]');
        }
    };
    return {
        connect:connect, 
        write:write,
        read:read
    };
  })();

