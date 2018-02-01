
const net = require('net');

const server = net.createServer((socket) => {
  console.log('socket connected: ' + socket.remoteAddress);
  //readable encoding
  //https://nodejs.org/dist/latest-v8.x/docs/api/stream.html#stream_readable_setencoding_encoding
  //selon ce que le client envoi
  //c'est un ByteBuffer 
  //si setter avec setEncoding il sera en hex ou utf-8
  //socket.setEncoding('utf8'); 
  //socket.setEncoding('hex'); 
  socket.write('àûôâ--hell oh!', () => {
    console.log('socket writed');
  });
  socket.on('drain', () => {
    console.log('socket write buffer empty');
  });
  //envoi sur une autre socket si on ne veut pas lire le stream -->
  //socket.pipe(otherSocketListening); 
  socket.on('end', () => {
    console.log('socket end');
  });
  socket.on('error', (err) => {
    console.log(err);
  });
  socket.on('close', () => {
    console.log('socket closed');
  });
  socket.on('data', (data) => {
    //https://nodejs.org/dist/latest-v8.x/docs/api/buffer.html#buffer_class_method_buffer_from_buffer
    console.log('data received');
    console.log(data);
    let buff = Buffer.from(data);
    console.log(buff.toString());
  });
}).on('error', (err) => {
  if(err.code === 'EADDRINUSE'){
    console.log('server address in use');
  }
  throw err;
});

server.listen(3200, 'localhost', ()=>{
  console.log('server listening on', server.address());
});






