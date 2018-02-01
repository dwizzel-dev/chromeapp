
const net = require('net');

const server = net.createServer((socket) => {
  console.log('socket connected');
  socket.write('hell oh!\r\n');
  //socket.pipe(socket);
  socket.on('end', () => {
    console.log('socket end');
    socket.end();
  });
  socket.on('error', (err) => {
    console.log(err);
  });
  socket.on('close', () => {
    console.log('socket closed');
  });
  socket.on('data', (data) => {
    console.log('data received');
    console.log(data);
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






