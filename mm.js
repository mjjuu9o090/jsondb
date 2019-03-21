const fs = require( 'fs' );
const serialize = require( 'node-serialize' );  

const mlog = require( './misc' ).mlog;
const cachesize = require( './misc' ).cachesize;
const limit = require( './misc' ).limit;

const path = './db/';

// cache object:
// {
//  id,
//  {
//      time    
//      data
//   }
// }

var search = function( cache, id, callback ){
    mlog( 'search start' );
    for( const [cid, data] of cache.entries() ){
        if( id == cid ){
            callback( data );
        }
    }
    mlog( 'fs search start' );
    fs.readdir( path, function(err, files ){
        if( err ){
            callback( {} );
        } else {
            files.forEach( function( file, index ){
                if( file === id ){
                    found = true;
                }
            } );
            if( found ){
                dearchive( id, cache, function(data){
                    callback( data );
                } );
            } else {
                callback( {} );
            }
        }
    } );
}

var archive = function( cache ){
    mlog( 'archiver called' );
    for( i = 0; i != limit; i++ ){
        id = '';
        time = Date.now();
        for( const [cid, obj] of cache.entries() ){
            if( obj.time <= time ){
                id = cid;
                time = obj.time;
            }
        }
        mlog( 'archivable: '+id );
        fs.writeFileSync( path + id, serialize.serialize( cache.get( id ) ));
        mlog(id + ' archived');
        cache.delete( id );
    }
}

var dearchive = function( id, cache, callback ){
    mlog( 'dearchiver called' );
    fs.readFile( path+id, function( err, content ){
        if( err ){
            mlog(err);
        } else {
            json = serialize.unserialize(content.toString());

            cache.set( id, {
                "time": Date.now(),
                "data": json.data
            } );

            if( cache.size > cachesize){ archive( cache ); }

            callback( cache.get( id ) );
        }
    } );
}

module.exports.search = search;
module.exports.archive = archive;
module.exports.dearchive = dearchive;