//Gros merci à
//https://gist.github.com/pascaldekloe/62546103a1576803dade9269ccf76330

// Marshals a string to Uint8Array.
var encoder = (function () {
    function encodeUTF8(s) {
        var i = 0;
        var bytes = new Uint8Array(s.length * 4);
        for (var ci = 0; ci != s.length; ci++) {
            var c = s.charCodeAt(ci);
            if (c < 128) {
                bytes[i++] = c;
                continue;
            }
            if (c < 2048) {
                bytes[i++] = c >> 6 | 192;
            } else {
                if (c > 0xd7ff && c < 0xdc00) {
                    if (++ci == s.length) throw 'UTF-8 encode: incomplete surrogate pair';
                    var c2 = s.charCodeAt(ci);
                    if (c2 < 0xdc00 || c2 > 0xdfff) throw 'UTF-8 encode: second char code 0x' + c2.toString(16) + ' at index ' + ci + ' in surrogate pair out of range';
                    c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
                    bytes[i++] = c >> 18 | 240;
                    bytes[i++] = c >> 12 & 63 | 128;
                } else { // c <= 0xffff
                    bytes[i++] = c >> 12 | 224;
                }
                bytes[i++] = c >> 6 & 63 | 128;
            }
            bytes[i++] = c & 63 | 128;
        }
        return bytes.subarray(0, i);
    }

    // Unmarshals an Uint8Array to string.
    function decodeUTF8(bytes) {
        var s = '';
        var i = 0;
        while (i < bytes.length) {
            var c = bytes[i++];
            if (c > 127) {
                if (c > 191 && c < 224) {
                    if (i >= bytes.length) throw 'UTF-8 decode: incomplete 2-byte sequence';
                    c = (c & 31) << 6 | bytes[i] & 63;
                } else if (c > 223 && c < 240) {
                    if (i + 1 >= bytes.length) throw 'UTF-8 decode: incomplete 3-byte sequence';
                    c = (c & 15) << 12 | (bytes[i] & 63) << 6 | bytes[++i] & 63;
                } else if (c > 239 && c < 248) {
                    if (i + 2 >= bytes.length) throw 'UTF-8 decode: incomplete 4-byte sequence';
                    c = (c & 7) << 18 | (bytes[i] & 63) << 12 | (bytes[++i] & 63) << 6 | bytes[++i] & 63;
                } else throw 'UTF-8 decode: unknown multibyte start 0x' + c.toString(16) + ' at index ' + (i - 1);
                ++i;
            }

            if (c <= 0xffff) s += String.fromCharCode(c);
            else if (c <= 0x10ffff) {
                c -= 0x10000;
                s += String.fromCharCode(c >> 10 | 0xd800)
                s += String.fromCharCode(c & 0x3FF | 0xdc00)
            } else throw 'UTF-8 decode: code point 0x' + c.toString(16) + ' exceeds UTF-16 reach';
        }
        return s;
    }

    return {
        encode: encodeUTF8,
        decode: decodeUTF8
    }

})();


var buffer = (function () {
    function arrayBuffertoString(buf) {
        return encoder.decode(new Uint8Array(buf));
        //return String.fromCharCode.apply(null, new Uint8Array(buf)); //for utf-16 Uint16Array 
    }
    function stringToArrayBuffer(str) {
        var buf = new ArrayBuffer(str.length); // 2 bytes for each char
        var bufView = new Uint8Array(buf); //for utf-16 Uint16Array 
        // From an iterable 
        /*
        var iterable = function*(){ 
            yield* [1,2,3]; 
        }();
        var uint8 = new Uint8Array(iterable); 
        */
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    function arraybufferEqual(buf1, buf2) {
        if (buf1 === buf2) {
            return true;
        }
        if (buf1.byteLength !== buf2.byteLength) {
            return false;
        }
        var view1 = new DataView(buf1);
        var view2 = new DataView(buf2);
        var i = buf1.byteLength;
        while (i--) {
            if (view1.getUint8(i) !== view2.getUint8(i)) {
                return false;
            }
        }
        return true;
    };

    return {
        to: stringToArrayBuffer,
        from: arrayBuffertoString,
        equal: arraybufferEqual
    };
})();