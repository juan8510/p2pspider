'use strict';

var fs = require('fs');
var path = require('path');

var p2pspider = require('../lib/index');

var kDataDir = path.join(__dirname, '..', 'data');

function dumpMeta(meta) {
    var name = meta.info.name.toString();
    var magnet = meta.magnet;
    var files = [];
    (meta.info.files || []).forEach(function (file) {
        file.path.forEach(function (path) {
            files.push(path.toString());
        });
    });

    var infohash = meta.infohash;
    var abs = path.join(kDataDir, infohash);
    if (fs.existsSync(abs)) {
        console.log('[*] %s - %s', magnet, name);
        return;
    }
    console.log('[+] %s - %s', magnet, name);
    fs.writeFileSync(abs, JSON.stringify({
        name: name,
        magnet: magnet,
        files: files
    }));
}


p2pspider(
    {
        address: '0.0.0.0',
        port: 6881,
        nodesMaxSize: 200,   // be careful
        maxConnections: 400, // be careful
        timeout: 5000,
        filter: function(infohash, callback) {
            var abs = path.join(kDataDir, infohash);
            callback(fs.existsSync(abs));
            // var theInfohashIsExistsInDatabase = false;
            // callback(theInfohashIsExistsInDatabase);
        }
    },
    function(metadata) {
        dumpMeta(metadata);
        // console.log(JSON.stringify(metadata, null, 2));
    }
);
