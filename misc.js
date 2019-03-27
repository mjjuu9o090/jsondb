const crypto = require( 'crypto' );

const secret = crypto.randomBytes(16).toString('hex');
//const secret = '1441a7909c087dbbe7ce59881b9df8b9';

const cachesize = 50;
const limit = 10;


var mlog = function ( msg, callback ){
    mlogmsg = '[' + new Date().toLocaleString() + '] ~ ' + msg;
    console.log( mlogmsg );
    if( callback ){ callback(); }
}

var getid = function( obj, callback ){

    sig = ''
    id = crypto.createHash( 'md5' ).update( JSON.stringify(obj) ).digest( 'hex' );
    for( i = 0; i != id.length; i++ ){
        sig += ( parseInt( id.charAt(i), 16 ) ^ parseInt( secret.charAt(i), 16 )).toString(16);
    }
        
    if( callback ){ callback( sig ); }
    else { return sig; }
}

module.exports.mlog = mlog;
module.exports.getid = getid;
module.exports.cachesize = cachesize;
module.exports.limit = limit;
