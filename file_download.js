var fs = require('fs');
var http = require('http');
var server = http.createServer( function( request, response ) {

    var filename = "./sample.zip";
    var raw = fs.createReadStream( filename );

    var resHeader = {
        'Content-Type' : 'application/zip',
        'Content-Disposition' : 'attachment; filename="sample.zip"'
    };

    response.writeHead(200, resHeader );
    raw.pipe(response);
//    response.end(); この行の実行時にはまだデータは送信されてません

    console.log("ファイル配信しました。");

}).listen(3000);