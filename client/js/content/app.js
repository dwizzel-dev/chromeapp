


window.onload = function() {
    logger.output("main window loaded");
    client.connect('localhost', 3200);
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
  var socketId = 0;
  var tcp = chrome.sockets.tcp;;
  var client = (function(){
    var connect = function(host, port){
        tcp.create(function(creationInfos){
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
                    tcp.onReceive.addListener(function(dataInfos){
                        logger.output('receiving data');
                        logger.output(dataInfos);
                        logger.warn(dataInfos.data);
                        client.write('hello back\r\n');
                        });
                    }
                });
            }else{
                logger.error('socket not created');
            }
        })
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
        write:write
    };
  })();

var buffer = (function(){
    function stringToArrayBuffer(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf)); //for utf-16 Uint16Array 
    }
    function arrayBuffertoString(str) {
        var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
        var bufView = new Uint8Array(buf); //for utf-16 Uint16Array 
        for (var i=0, strLen=str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
    return {
        to:arrayBuffertoString, 
        from:arrayBuffertoString
    };
  })();