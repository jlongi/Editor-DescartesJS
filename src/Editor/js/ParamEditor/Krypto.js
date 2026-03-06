/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  let MathSin = Math.sin;
  let MathFloor = Math.floor;
  let MathRandom = Math.random;
  let MathRound = Math.round;
  let MathAbs = Math.abs;
  let stringFromCharCode = String.fromCharCode;
  
  const a1 = 1.0;
  const a2 = 1.4;
  const a3 = 0.6;
  const a4 = 2.2;

  let ll;

  let n;
  let a;
  let b;
  let c;

  let encryptMeu;
  let decryptMeu;
  let nx;
  let x;
  let y;

  class Krypto {
    /**
     * Descartes krypto
     * @param {String} key the key of encryption
     */
    constructor(key = 0){
      this.key = key.toString();
    }

    /**
     * @param {Number} n
     * @return {String}
     */
    getKey(n) {
      ll = [];
      for (let i=0; i<256; i++) {
        ll[i] = stringFromCharCode(this.alfanum( MathFloor( MathAbs(7.5*(MathSin(a1*i-n) + MathSin(a2*i+n) + MathSin(a3*i-n) + MathSin(a4*i+n))) ) ));
      }
      
      return ll.join("");
    }
    
    /**
     * @param {String} s the string to encode
     * @return {String}
     */
    encode(s) {
      n = MathFloor(31*MathRandom());
      this.key = this.getKey(n);
      
      return stringFromCharCode(this.alfanum(n)) + this.encripta(s);
    }
    
    /**
     * @param {String} s the string to decode
     * @return {String}
     */
    decode(s) {
      n = this.numalfa( s.charCodeAt(0) );
      this.key = this.getKey(n);

      return this.desencripta(s.substring(1));
    }

    /**
     * @param {String} OrigMeu
     * @return {String}
     */
    encripta(OrigMeu) {
      return this.bytesToString( this.encriptaAux(this.stringToBytes(OrigMeu)));
    }
    
    /**
     * @param {Array<Bytes>} OrigMeu
     * @return {String}
     */
    encriptaAux(OrigMeu) {
      if ((OrigMeu == null) || (this.key == null)) {
        return null;
      }
      
      encryptMeu = new Array(3*OrigMeu.length);
      
      for (let i=0, l=OrigMeu.length; i<l; i++) {
        x = MathFloor(OrigMeu[i]+128)*256 + MathRound(MathRandom()*255) + MathRound(MathRandom()*255)*256*256;
        y = MathFloor((x<<this.shift(i))/256);

        encryptMeu[3*i]   = this.alfanum(y%32); 
        encryptMeu[3*i+1] = this.alfanum((y/32)%32);
        encryptMeu[3*i+2] = this.alfanum((y/1024)%32);
      }

      return encryptMeu;
    }
      
    /**
     * @param {String} OrigMeu
     * @return {String}
     */
    desencripta(OrigMeu) {
      return this.bytesToString( this.desencriptaAux(this.stringToBytes(OrigMeu)));
    }
    
    /**
     * @param {Array<Bytes>} OrigMeu
     * @return {String}
     */
    desencriptaAux(OrigMeu) {
      if ((OrigMeu == null) || (this.key == null)) {
        return null;
      }

      decryptMeu = new Array(OrigMeu.length/3);

      for (let i=0, l=decryptMeu.length; i<l; i++) {
        y = this.numalfa(OrigMeu[3*i]) + this.numalfa(OrigMeu[3*i+1])*32 + this.numalfa(OrigMeu[3*i+2])*1024;
        x = MathFloor((y*256)>>this.shift(i));
        
        nx = (MathFloor(x/256)%256)-128;
        if (nx < 0) {
          nx = nx +256;
        }
        
        decryptMeu[i] = nx;
      }
      
      return decryptMeu;   
    }
    
    /**
     * @param Number {Array<Number>} k
     * @return Number {Array<Number>}
     */
    alfanum(k) {
      return ((k < 10) ? 48 : 87) + MathFloor(k);
    }
    
    /**
     * @param Number {Array<Number>} b
     * @return Number {Array<Number>}
     */
    numalfa(b) {
      return b - ((b < 58) ? 48 : 87);
    }
    
    /**
     * @param {String} 
     * @return {Array<Number>}
     */
    stringToBytes(OrigMeu) {
      b = [];
      
      for (let i=0, l=OrigMeu.length; i<l; i++) {
        b.push( OrigMeu.charCodeAt(i) );
      }
      
      return b;
    }

    /**
     * @param {Array<Number>}
     * @return {String} 
     */
    bytesToString(b) {
      for (let i=0, l=b.length; i<l; i++) {
        b[i] = stringFromCharCode(b[i]);
      }

      return b.join("");
    }
    
    /**
     * @param {Number}
     * @return {Number} 
     */
    shift(i) {
      a = (this.key).charCodeAt(i%(this.key.length));
      b = this.numalfa(a);
      c = MathFloor((b/2)%8);
      if (c == 0) {
        c = 4;
      }
      return c;
    }

    /**
     * @param {String} n
     * @return {Array<Number>}
     */
    parseByte(n) {
      n = parseInt(n);
      n = (n < 0) ? 0 : n;
      n = (n > 255) ? 255 : n;
      
      return n;
    }
  }

  paramEditor.Krypto = Krypto;
  return paramEditor;
})(paramEditor || {});
