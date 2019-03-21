const PORT = 3000;
const app = require( 'express' )();

const mlog = require( './misc' ).mlog;
const getid = require( './misc' ).getid;
const cachesize = require( './misc' ).cachesize;

const search = require( './mm' ).search;
const archive = require( './mm' ).archive;

var cache = new Map();

app.use( require( 'body-parser' ).json() );


app.use( function( req, res, next ){
    //TODO: mlogging middleware
//    mlog( 'logging middleware reached' );
    next();
} );


//TODO:
// get to read, in: id, out: json
//  not found: 404

// put to store, in: json, out: id
//  id = hash xor secret
// delete, in id

// memory model
//  cache: <id, {time, json}>
//  disk: filename: id, content: json

app.get( '/', function( req, res ){
    //TODO: send short manual
    res.header( 'Content-Type', 'text/html' );
    res.send('OK');
} );

app.get( '/api/v1/json', function( req, res ){
    res.header( 'Content-Type', 'application/json' );
    id = req.query.id;
    mlog( 'recvd: ' + id );
    search( cache, id, function( data ){
        mlog('at search ' + JSON.stringify(data))
        if( Object.keys(data).length != 0 ){
            res.send(data.data);
        } else {
            res.status( 404 ).end();
        }
    } );
} );

app.put( '/api/v1/json', function( req, res ){
    res.header( 'Content-Type', 'text/html' );
    obj = req.body;
    id = getid( obj );
    cache.set( id, {
        "time": Date.now(),
        "data": obj
    });
    res.status( 200 );
    res.send( id );
    if( cache.size > cachesize){ archive( cache ); }
} );


app.listen( PORT, function(){
    mlog( 'listening on ' + PORT )
} );

