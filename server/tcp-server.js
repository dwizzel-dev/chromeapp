

//https://github.com/cayasso/mongo-oplog

var _ = require('lodash');
const net = require('net');
var sockets = {};

var socketIds = function(){
  return Math.floor(Math.random() * 1000);
}

var socket = function(socket){
  //readable encoding
  //https://nodejs.org/dist/latest-v8.x/docs/api/stream.html#stream_readable_setencoding_encoding
  //selon ce que le client envoi
  //c'est un ByteBuffer 
  //si setter avec setEncoding il sera en hex ou utf-8
  //socket.setEncoding('utf8'); 
  //socket.setEncoding('hex'); 
  
  socket.write('àûôâ--hell oh!', () => {
    console.log('socket[' + socket.id + '] writed');
  });
  socket.on('drain', () => {
    console.log('socket[' + socket.id + '] write buffer empty');
  });
  //envoi sur une autre socket si on ne veut pas lire le stream -->
  //socket.pipe(otherSocketListening); 
  socket.on('end', () => {
    console.log('socket[' + socket.id + '] end');
  });
  socket.on('error', (err) => {
    console.log(err);
  });
  socket.on('close', () => {
    //delete sockets[socket.id];
    _.unset(sockets, socket.id);
    showSockets();
    console.log('socket[' + socket.id + '] closed');
  });
  socket.on('data', (data) => {
    //https://nodejs.org/dist/latest-v8.x/docs/api/buffer.html#buffer_class_method_buffer_from_buffer
    console.log('socket[' + socket.id + '] data received');
    console.log(data);
    let buff = Buffer.from(data);
    console.log(buff.toString());
    broadcast('ID: ' + socket.id);
    socketWrite(socket.id, 'welcome!');
  });
  return socket;
};

var broadcast = function(msg){
  _.forEach(sockets, (v, k) =>{
    v.write(msg, () => {
      console.log('socket[' + k + '] broadcast write');
    });
  });
};

var socketWrite = function(socketId, msg){
  if(typeof sockets[socketId] == 'object'){
    sockets[socketId].write(msg, () => {
      console.log('socket[' + socketId + '] socketWrite = "' + msg + '"');
    });
  }
};

var showSockets = function(){
  _.forEach(sockets, (v, k)=>{
    console.log('socket[' + k + '] all');
  });
}

const server = net.createServer((conn) => {
  console.log('socket connected');
  conn.id = socketIds();
  sockets[conn.id] = socket(conn);
}).on('error', (err) => {
  if(err.code === 'EADDRINUSE'){
    console.log('server address in use');
  }
  throw err;
});

server.listen(3200, 'localhost', ()=>{
  console.log('server listening on', server.address());
});






