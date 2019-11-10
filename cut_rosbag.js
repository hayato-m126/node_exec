const fs = require('fs');
const http = require('http');

const {execSync} = require('child_process');

let server = http.createServer(
    (request, response)=>{
        execSync('rosbag filter 2011-01-19-07-49-38.bag filter.bag "t.secs <= 1295452260"');
        console.log("finished filter")
        var filename = "./filter.bag";
        var raw = fs.createReadStream( filename );
        var resHeader = {
            'Content-Type' : 'application/rosbag',
            'Content-Disposition' : 'attachment; filename="filter.bag"'
        };
        response.writeHead(200, resHeader );
        raw.pipe(response);
        console.log("ファイル配信しました。");
    }
);
server.listen(3000);