
//-----------------------------
/*
console.log('+++++++++++++++++++++++++++');
let buff = buffer.to('Toyota Élantra'.padEnd(20,' '));
var blob = new Blob([buff], {type: 'application/octet-stream'});
var reader = new FileReader();
reader.addEventListener("loadend", function() {
  let str = buffer.from(reader.result);
  console.log(str);
});
reader.readAsArrayBuffer(blob);


//----------------------------------------------------

/*
const struct = {
  buff: () => new ArrayBuffer(25), 
  trans: (buff) => ArrayBuffer.transfert(buff, 25),
  name: (buff) => Uint8Array(buff, 0, 20), //20
  id: (buff) => new Uint32Array(buff, 20, 4), //4
  category: (buff) => Uint8Array(buff, 24, 1), //1
};
*/
//let structBuff = struct.trans(buffer.to('Toyota Élantra'.padEnd(20,' ')));
//let idView = new Uint8Array(structBuff);

console.log('-----------------------------------------');

const enc = new (require('util')).TextEncoder();
const dec = new (require('util')).TextDecoder('utf-8');
const fs = require('fs');

/*
//from string
var uInt16 = Uint16Array.from('12314');
console.log('uInt16:' + uInt16.includes(4));
//from array
let uInt8 = new Uint8Array([72, 101, 108, 108, 20, 111]);
console.log('uInt8:' + uInt8.includes(20));

let byt = enc.encode(`À l'école`);
console.log('[' + byt + '] = ' + dec.decode(byt));
*/

function open(fname, type){
  // Return new promise 
  return new Promise(function(resolve, reject) {
    fs.open(fname, type, function(err, fd) {
      if (err) {
        //return reject(new Error('blablalba'));
        return reject(err); 
      }
      console.log(`Open fd: ${fd}`);
      return resolve(fd);
    });
  });
}

function write(fd){
  //let byt = new Uint32Array([10000000, 65000, 52, 687523, 20, 111, 30000000,]);
  let byt = enc.encode(`À l'école`);
  let buf = Buffer.from(byt);
  return new Promise(function(resolve, reject){
    fs.write(fd, buf, function(err, bytesWritten, buffer){
      if(err){
        return reject(err);
      }
      console.log(`buffer write: ${buffer}`);
      console.log(`bytesWritten: ${bytesWritten}`);
      return resolve(fd);
    });
  });
}

function read(fd){
  return new Promise(function(resolve, reject){
    let size = 30;
    let buf = new Buffer(size);
    fs.read(fd, buf, 0, buf.length, null, function(err, bytesRead, buffer){
      if(err){
        return reject(err);
      }
      console.log(`buffer read: ${buffer}`);
      console.log(`bytesRead: ${bytesRead}`);
      return resolve(fd);
    });
  });
}

function close(fd){
  return new Promise(function(resolve, reject){
    fs.close(fd, function(err){
      if(err){
        return reject(err);
      }
      console.log(`Close fd: ${fd}`);
      return resolve();
    });
  });
}




//SYNC: sequence open write read binary to file

var file = 'test.txt'; 
open(file, 'w')
  .then(function(fd){
    return write(fd);
  })
  .then(function(fd){
    return close(fd);
  })
  .then(function(){
    return open(file, 'r');
  })
  .then(function(fd){
    return read(fd);
  })
  .then(function(fd){
    return close(fd);
  })
  .then(function(fd){
    console.log('Done');
  })
  .catch(function(err){
    console.log('Oups!!!');
    console.log(err);
  });


/*
var arr = [];
var bin = [];
for(var i=0; i !== 1000; i++){
  arr[i] = [];
  for(var j=0; j !== 100000; j++){
    arr[i].push(Math.floor(Math.random() * 1000024));
  }
  bin[i] = new Uint32Array(arr[i]);
}

var t = Date.now();
for(var i=0, len = arr.length; i !== len; i++ ){
  if(arr[i].indexOf(235) !== -1){
    //console.log('arr found:' + i);
  }
}
console.log('arr:' + (Date.now() - t));

var t = Date.now();
for(var i=0, len = bin.length; i !== len; i++ ){
  if(bin[i].includes(235)){
    //console.log('bin found:' + i);
  }
}
console.log('bin:' + (Date.now() - t));
*/



  //EOF